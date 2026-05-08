// Workflow Executor - Orchestrates multi-agent workflows

import {
  Workflow,
  WorkflowStep,
  WorkflowStatus,
  AgentInput,
  AgentOutput,
  AgentEvent,
  AgentEventType,
  WorkflowContext,
  WorkflowTemplate,
  WORKFLOW_TEMPLATES,
  AGENT_CONFIGS,
} from "./types"
import { AGENT_RUNNERS } from "./agents"

export type EventCallback = (event: AgentEvent) => void

export class WorkflowExecutor {
  private workflow: Workflow
  private eventCallbacks: EventCallback[] = []
  private isRunning = false
  private isPaused = false

  constructor(workflow: Workflow) {
    this.workflow = workflow
  }

  // Subscribe to workflow events
  onEvent(callback: EventCallback): () => void {
    this.eventCallbacks.push(callback)
    return () => {
      this.eventCallbacks = this.eventCallbacks.filter((cb) => cb !== callback)
    }
  }

  // Emit an event to all subscribers
  private emit(type: AgentEventType, data?: Partial<AgentEvent>): void {
    const event: AgentEvent = {
      type,
      workflowId: this.workflow.id,
      timestamp: new Date().toISOString(),
      ...data,
    }
    this.eventCallbacks.forEach((cb) => cb(event))
  }

  // Get current workflow state
  getWorkflow(): Workflow {
    return { ...this.workflow }
  }

  // Start or resume the workflow
  async run(): Promise<Workflow> {
    if (this.isRunning) {
      throw new Error("Workflow is already running")
    }

    this.isRunning = true
    this.isPaused = false
    this.workflow.status = "running"
    this.workflow.updatedAt = new Date().toISOString()

    this.emit("workflow_started", {
      data: { workflowName: this.workflow.name },
    })

    try {
      // Process each step sequentially
      while (this.workflow.currentStepIndex < this.workflow.steps.length) {
        if (this.isPaused) {
          this.workflow.status = "paused"
          break
        }

        const stepIndex = this.workflow.currentStepIndex
        const step = this.workflow.steps[stepIndex]

        // Update step status
        step.status = "running"
        step.startedAt = new Date().toISOString()

        this.emit("step_started", {
          stepIndex,
          agentType: step.agentType,
          data: { stepName: AGENT_CONFIGS[step.agentType].name },
        })

        // Prepare agent input
        const agentInput: AgentInput = {
          userId: this.workflow.userId,
          workflowId: this.workflow.id,
          stepIndex,
          data: this.getAccumulatedData(),
          context: this.workflow.context,
        }

        // Run the agent
        const agentRunner = AGENT_RUNNERS[step.agentType]
        const output = await agentRunner(agentInput)

        // Update step with output
        step.output = output
        step.completedAt = new Date().toISOString()

        if (output.success) {
          step.status = "completed"
          
          // Add output to context for next agents
          this.workflow.context.previousSteps.push(output)

          // Emit progress events for each reasoning trace
          for (const trace of output.reasoning) {
            this.emit("step_progress", {
              stepIndex,
              agentType: step.agentType,
              reasoning: trace,
            })
          }

          this.emit("step_completed", {
            stepIndex,
            agentType: step.agentType,
            data: {
              confidence: output.confidence,
              executionTime: output.executionTimeMs,
            },
          })
        } else {
          step.status = "failed"
          step.error = output.error

          this.emit("step_failed", {
            stepIndex,
            agentType: step.agentType,
            data: { error: output.error },
          })

          // Handle failure - can retry or abort
          const config = AGENT_CONFIGS[step.agentType]
          const retryCount = (step as unknown as { retryCount?: number }).retryCount || 0

          if (retryCount < config.maxRetries) {
            // Retry the step
            (step as unknown as { retryCount: number }).retryCount = retryCount + 1
            step.status = "running"
            continue
          } else {
            // Max retries reached, fail the workflow
            this.workflow.status = "failed"
            this.emit("workflow_failed", {
              data: { 
                error: output.error,
                failedStep: stepIndex,
                agentType: step.agentType,
              },
            })
            break
          }
        }

        // Move to next step
        this.workflow.currentStepIndex++
        this.workflow.updatedAt = new Date().toISOString()
      }

      // Check if workflow completed successfully
      if (
        this.workflow.currentStepIndex >= this.workflow.steps.length &&
        this.workflow.status === "running"
      ) {
        this.workflow.status = "completed"
        this.workflow.completedAt = new Date().toISOString()
        this.emit("workflow_completed", {
          data: {
            totalSteps: this.workflow.steps.length,
            completedSteps: this.workflow.steps.filter((s) => s.status === "completed").length,
          },
        })
      }
    } catch (error) {
      this.workflow.status = "failed"
      this.emit("workflow_failed", {
        data: { error: error instanceof Error ? error.message : "Unknown error" },
      })
    } finally {
      this.isRunning = false
    }

    return this.getWorkflow()
  }

  // Pause the workflow
  pause(): void {
    this.isPaused = true
    this.emit("step_progress", {
      data: { message: "Workflow paused" },
    })
  }

  // Get accumulated data from all completed steps
  private getAccumulatedData(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    
    for (const step of this.workflow.steps) {
      if (step.status === "completed" && step.output?.data) {
        Object.assign(data, step.output.data)
      }
    }
    
    return data
  }
}

// Create a new workflow from a template
export function createWorkflow(
  templateId: string,
  userId: string,
  context: Partial<WorkflowContext>
): Workflow {
  const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId)
  
  if (!template) {
    throw new Error(`Template not found: ${templateId}`)
  }

  const workflowId = `WF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const steps: WorkflowStep[] = template.steps.map((stepDef, index) => ({
    index,
    agentType: stepDef.agentType,
    status: "idle",
  }))

  const defaultContext: WorkflowContext = {
    userId,
    documents: [],
    userProfile: {
      id: userId,
      aadhaarVerified: false,
      documents: [],
    },
    previousSteps: [],
    metadata: {},
    ...context,
  }

  return {
    id: workflowId,
    userId,
    name: template.name,
    description: template.description,
    type: template.type,
    status: "pending",
    steps,
    currentStepIndex: 0,
    context: defaultContext,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Get available workflow templates
export function getWorkflowTemplates(): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES
}
