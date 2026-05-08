import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createWorkflow, WorkflowExecutor } from "@/lib/agents/workflow-executor"
import { Workflow, WorkflowContext } from "@/lib/agents/types"

// GET - List workflows for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: workflows, error } = await supabase
      .from("workflows")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ workflows })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch workflows" },
      { status: 500 }
    )
  }
}

// POST - Create and optionally execute a new workflow
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { templateId, context, execute = false } = body

    if (!templateId) {
      return NextResponse.json({ error: "Template ID is required" }, { status: 400 })
    }

    // Get user profile for context
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    // Get user documents for context
    const { data: documents } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)

    // Build workflow context
    const workflowContext: Partial<WorkflowContext> = {
      userProfile: {
        id: user.id,
        fullName: profile?.full_name || user.email?.split("@")[0],
        email: user.email,
        phone: profile?.phone,
        aadhaarVerified: profile?.aadhaar_verified || false,
        documents: documents?.map((d) => d.id) || [],
        demographics: context?.demographics || {},
      },
      documents: documents?.map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        extractedData: d.ai_extracted_data || {},
        verificationStatus: d.verification_status,
      })) || [],
      ...context,
    }

    // Create the workflow
    const workflow = createWorkflow(templateId, user.id, workflowContext)

    // Save to database
    const { data: savedWorkflow, error: saveError } = await supabase
      .from("workflows")
      .insert({
        id: workflow.id,
        user_id: user.id,
        workflow_type: workflow.type,
        status: workflow.status,
        steps: workflow.steps,
        current_step: workflow.currentStepIndex,
        started_at: workflow.createdAt,
      })
      .select()
      .single()

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 })
    }

    // Optionally execute the workflow
    if (execute) {
      const executor = new WorkflowExecutor(workflow)
      
      // Subscribe to events and save agent logs
      executor.onEvent(async (event) => {
        if (event.type === "step_completed" || event.type === "step_failed") {
          await supabase.from("agent_logs").insert({
            user_id: user.id,
            workflow_id: workflow.id,
            agent_type: event.agentType,
            action: event.type,
            input_data: {},
            output_data: event.data || {},
            reasoning: event.reasoning?.thought,
            confidence_score: event.reasoning?.confidence ? event.reasoning.confidence / 100 : null,
          })
        }

        // Update workflow status
        if (event.type === "workflow_completed" || event.type === "workflow_failed") {
          await supabase
            .from("workflows")
            .update({
              status: event.type === "workflow_completed" ? "completed" : "failed",
              completed_at: new Date().toISOString(),
            })
            .eq("id", workflow.id)
        }
      })

      const result = await executor.run()

      return NextResponse.json({
        workflow: result,
        executed: true,
      })
    }

    return NextResponse.json({
      workflow: savedWorkflow,
      executed: false,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create workflow" },
      { status: 500 }
    )
  }
}
