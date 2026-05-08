"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Search,
  FileCheck,
  UserCheck,
  FileText,
  Send,
  Bell,
  Brain,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Sparkles,
  Activity,
  Eye,
} from "lucide-react"
import Link from "next/link"
import {
  Workflow,
  WorkflowStep,
  AgentType,
  AgentEvent,
  ReasoningTrace,
  AGENT_CONFIGS,
  WORKFLOW_TEMPLATES,
} from "@/lib/agents/types"
import { WorkflowExecutor, createWorkflow } from "@/lib/agents/workflow-executor"

const agentIcons: Record<AgentType, React.ElementType> = {
  research: Search,
  eligibility: UserCheck,
  ocr: FileCheck,
  submission: Send,
  notification: Bell,
  reflection: Brain,
}

const agentColors: Record<AgentType, string> = {
  research: "bg-blue-500",
  eligibility: "bg-green-500",
  ocr: "bg-purple-500",
  submission: "bg-orange-500",
  notification: "bg-pink-500",
  reflection: "bg-cyan-500",
}

interface ExecutionLog {
  timestamp: string
  type: string
  message: string
  agentType?: AgentType
  data?: Record<string, unknown>
}

export default function WorkflowExecutePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [workflow, setWorkflow] = useState<Workflow | null>(null)
  const [executor, setExecutor] = useState<WorkflowExecutor | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([])
  const [currentReasoning, setCurrentReasoning] = useState<ReasoningTrace[]>([])
  const [userProfile, setUserProfile] = useState({
    fullName: "Demo User",
    occupation: "farmer",
    income: 150000,
    state: "Maharashtra",
    landHolding: 1.5,
    age: 35,
  })

  // Handle workflow events
  const handleEvent = useCallback((event: AgentEvent) => {
    const log: ExecutionLog = {
      timestamp: event.timestamp,
      type: event.type,
      message: getEventMessage(event),
      agentType: event.agentType,
      data: event.data,
    }
    setExecutionLogs((prev) => [...prev, log])

    // Update reasoning traces
    if (event.reasoning) {
      setCurrentReasoning((prev) => [...prev, event.reasoning!])
    }

    // Update workflow state
    if (event.type === "step_completed" || event.type === "step_failed") {
      setWorkflow((prev) => prev ? { ...prev } : null)
    }
  }, [])

  // Get human-readable event message
  function getEventMessage(event: AgentEvent): string {
    const agentName = event.agentType ? AGENT_CONFIGS[event.agentType].name : ""
    
    switch (event.type) {
      case "workflow_started":
        return `Workflow started: ${event.data?.workflowName}`
      case "step_started":
        return `${agentName} started processing...`
      case "step_progress":
        return event.reasoning?.observation || event.data?.message || "Processing..."
      case "step_completed":
        return `${agentName} completed with ${event.data?.confidence}% confidence`
      case "step_failed":
        return `${agentName} failed: ${event.data?.error}`
      case "workflow_completed":
        return `Workflow completed! ${event.data?.completedSteps}/${event.data?.totalSteps} steps successful`
      case "workflow_failed":
        return `Workflow failed: ${event.data?.error}`
      default:
        return event.type
    }
  }

  // Initialize workflow from template
  const initializeWorkflow = () => {
    if (!selectedTemplate) return

    const newWorkflow = createWorkflow(selectedTemplate, "demo-user", {
      userProfile: {
        id: "demo-user",
        fullName: userProfile.fullName,
        aadhaarVerified: true,
        documents: [],
        demographics: {
          age: userProfile.age,
          occupation: userProfile.occupation,
          income: userProfile.income,
          state: userProfile.state,
          landHolding: userProfile.landHolding,
        },
      },
      documents: [
        { id: "doc-1", name: "Aadhaar Card", type: "aadhaar", extractedData: {}, verificationStatus: "pending" },
        { id: "doc-2", name: "Land Records", type: "land_record", extractedData: {}, verificationStatus: "pending" },
      ],
    })

    setWorkflow(newWorkflow)
    setExecutionLogs([])
    setCurrentReasoning([])

    const newExecutor = new WorkflowExecutor(newWorkflow)
    newExecutor.onEvent(handleEvent)
    setExecutor(newExecutor)
  }

  // Start workflow execution
  const startWorkflow = async () => {
    if (!executor) return

    setIsRunning(true)
    try {
      const result = await executor.run()
      setWorkflow(result)
    } catch (error) {
      console.error("Workflow execution error:", error)
    } finally {
      setIsRunning(false)
    }
  }

  // Pause workflow
  const pauseWorkflow = () => {
    if (executor) {
      executor.pause()
    }
  }

  // Reset workflow
  const resetWorkflow = () => {
    setWorkflow(null)
    setExecutor(null)
    setExecutionLogs([])
    setCurrentReasoning([])
    setIsRunning(false)
  }

  // Calculate progress
  const progress = workflow
    ? (workflow.steps.filter((s) => s.status === "completed").length / workflow.steps.length) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/workflows">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Execute Workflow</h1>
            <p className="text-muted-foreground">Run multi-agent workflows with real-time tracking</p>
          </div>
        </div>
        {workflow && (
          <div className="flex items-center gap-2">
            <Badge variant={workflow.status === "running" ? "default" : workflow.status === "completed" ? "secondary" : "outline"}>
              {workflow.status}
            </Badge>
          </div>
        )}
      </div>

      {!workflow ? (
        /* Workflow Setup */
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Workflow Template</CardTitle>
              <CardDescription>Choose a pre-configured workflow to execute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a workflow template" />
                </SelectTrigger>
                <SelectContent>
                  {WORKFLOW_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTemplate && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <h4 className="font-medium text-foreground">
                    {WORKFLOW_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {WORKFLOW_TEMPLATES.find((t) => t.id === selectedTemplate)?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {WORKFLOW_TEMPLATES.find((t) => t.id === selectedTemplate)?.steps.map((step, i) => {
                      const Icon = agentIcons[step.agentType]
                      return (
                        <Badge key={i} variant="outline" className="gap-1">
                          <Icon className="w-3 h-3" />
                          {step.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Profile (Demo)</CardTitle>
              <CardDescription>Configure user data for the workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={userProfile.fullName}
                    onChange={(e) => setUserProfile((p) => ({ ...p, fullName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Occupation</Label>
                  <Select
                    value={userProfile.occupation}
                    onValueChange={(v) => setUserProfile((p) => ({ ...p, occupation: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="farmer">Farmer</SelectItem>
                      <SelectItem value="business">Business Owner</SelectItem>
                      <SelectItem value="startup">Startup Founder</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="employed">Employed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Annual Income (INR)</Label>
                  <Input
                    type="number"
                    value={userProfile.income}
                    onChange={(e) => setUserProfile((p) => ({ ...p, income: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select
                    value={userProfile.state}
                    onValueChange={(v) => setUserProfile((p) => ({ ...p, state: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                      <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Land Holding (Hectares)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={userProfile.landHolding}
                    onChange={(e) => setUserProfile((p) => ({ ...p, landHolding: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    value={userProfile.age}
                    onChange={(e) => setUserProfile((p) => ({ ...p, age: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={initializeWorkflow}
                disabled={!selectedTemplate}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Initialize Workflow
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Workflow Execution View */
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Workflow Steps */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <Badge variant={workflow.status === "completed" ? "default" : "outline"} className={workflow.status === "completed" ? "bg-green-500/10 text-green-600" : ""}>
                    {workflow.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {workflow.steps.map((step, index) => {
                  const Icon = agentIcons[step.agentType]
                  const config = AGENT_CONFIGS[step.agentType]
                  const isActive = index === workflow.currentStepIndex && isRunning
                  const isCompleted = step.status === "completed"
                  const isFailed = step.status === "failed"

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? "border-primary bg-primary/5"
                          : isCompleted
                          ? "border-green-500/30 bg-green-500/5"
                          : isFailed
                          ? "border-red-500/30 bg-red-500/5"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? "bg-green-500"
                              : isFailed
                              ? "bg-red-500"
                              : isActive
                              ? agentColors[step.agentType]
                              : "bg-muted"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : isFailed ? (
                            <XCircle className="w-5 h-5 text-white" />
                          ) : isActive ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="w-5 h-5 text-white" />
                            </motion.div>
                          ) : (
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground text-sm">{config.name}</h4>
                            {step.output?.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {step.output.confidence}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {config.description}
                          </p>
                          {step.output?.executionTimeMs && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed in {(step.output.executionTimeMs / 1000).toFixed(1)}s
                            </p>
                          )}
                          {step.error && (
                            <p className="text-xs text-red-500 mt-1">{step.error}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Control Buttons */}
                <div className="flex gap-2 pt-4">
                  {workflow.status === "pending" && (
                    <Button className="flex-1" onClick={startWorkflow}>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </Button>
                  )}
                  {isRunning && (
                    <Button variant="secondary" className="flex-1" onClick={pauseWorkflow}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetWorkflow}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Execution Details */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <Tabs defaultValue="reasoning" className="h-full flex flex-col">
                <CardHeader className="pb-0">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="reasoning">
                      <Brain className="w-4 h-4 mr-2" />
                      Reasoning
                    </TabsTrigger>
                    <TabsTrigger value="logs">
                      <Activity className="w-4 h-4 mr-2" />
                      Logs
                    </TabsTrigger>
                    <TabsTrigger value="output">
                      <Eye className="w-4 h-4 mr-2" />
                      Output
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="flex-1 pt-4">
                  <TabsContent value="reasoning" className="h-full mt-0">
                    <ScrollArea className="h-[500px] pr-4">
                      {currentReasoning.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Start the workflow to see AI reasoning traces</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {currentReasoning.map((trace, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-muted/50 rounded-xl space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline">{trace.action}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {trace.confidence}% confidence
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                  {'"'}{trace.thought}{'"'}
                                </p>
                                <p className="text-sm text-foreground">
                                  {trace.observation}
                                </p>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="logs" className="h-full mt-0">
                    <ScrollArea className="h-[500px] pr-4">
                      {executionLogs.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No execution logs yet</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {executionLogs.map((log, index) => {
                            const Icon = log.agentType ? agentIcons[log.agentType] : Zap
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg"
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  log.type.includes("completed") || log.type === "workflow_completed"
                                    ? "bg-green-500/10 text-green-500"
                                    : log.type.includes("failed")
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-primary/10 text-primary"
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground">{log.message}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="output" className="h-full mt-0">
                    <ScrollArea className="h-[500px] pr-4">
                      {workflow.steps.filter((s) => s.status === "completed").length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No outputs yet</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {workflow.steps
                            .filter((s) => s.status === "completed" && s.output)
                            .map((step, index) => {
                              const config = AGENT_CONFIGS[step.agentType]
                              const Icon = agentIcons[step.agentType]
                              return (
                                <Card key={index} className="bg-muted/30">
                                  <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${agentColors[step.agentType]}`}>
                                        <Icon className="w-4 h-4 text-white" />
                                      </div>
                                      <CardTitle className="text-base">{config.name} Output</CardTitle>
                                    </div>
                                  </CardHeader>
                                  <CardContent>
                                    <pre className="text-xs text-muted-foreground bg-background p-3 rounded-lg overflow-auto max-h-40">
                                      {JSON.stringify(step.output?.data, null, 2)}
                                    </pre>
                                  </CardContent>
                                </Card>
                              )
                            })}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
