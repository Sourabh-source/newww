import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - List agent logs for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const workflowId = searchParams.get("workflowId")
    const agentType = searchParams.get("agentType")
    const limit = parseInt(searchParams.get("limit") || "50")

    let query = supabase
      .from("agent_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (workflowId) {
      query = query.eq("workflow_id", workflowId)
    }

    if (agentType) {
      query = query.eq("agent_type", agentType)
    }

    const { data: logs, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ logs })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch agent logs" },
      { status: 500 }
    )
  }
}

// POST - Create a new agent log entry
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      workflowId,
      agentType,
      action,
      inputData,
      outputData,
      reasoning,
      confidenceScore,
      executionTimeMs,
    } = body

    if (!agentType || !action) {
      return NextResponse.json(
        { error: "Agent type and action are required" },
        { status: 400 }
      )
    }

    const { data: log, error } = await supabase
      .from("agent_logs")
      .insert({
        user_id: user.id,
        workflow_id: workflowId || null,
        agent_type: agentType,
        action,
        input_data: inputData || {},
        output_data: outputData || {},
        reasoning: reasoning || null,
        confidence_score: confidenceScore ? confidenceScore / 100 : null,
        execution_time_ms: executionTimeMs || null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ log })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create agent log" },
      { status: 500 }
    )
  }
}
