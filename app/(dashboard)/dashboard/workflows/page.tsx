"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  GitBranch,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Play,
  Eye,
  ArrowRight,
  FileCheck,
  UserCheck,
  FileText,
  Send,
  Bot,
  ChevronDown,
  ChevronRight,
  Zap,
  Plus,
  Search,
  Bell,
  Brain,
  Activity,
  Sparkles,
} from "lucide-react"
import { WORKFLOW_TEMPLATES, AGENT_CONFIGS, AgentType } from "@/lib/agents/types"

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

const workflows = [
  {
    id: "WF-001",
    name: "PM-KISAN Application Workflow",
    application: "APP-2024-003",
    status: "in_progress",
    progress: 60,
    currentStep: 3,
    totalSteps: 5,
    startedAt: "2024-02-10T10:30:00",
    steps: [
      { name: "Document Upload", status: "completed", agent: "User", agentType: "ocr" as AgentType, time: "10:30 AM" },
      { name: "Document Verification", status: "completed", agent: "OCR Agent", agentType: "ocr" as AgentType, time: "10:32 AM" },
      { name: "Eligibility Check", status: "completed", agent: "Eligibility Agent", agentType: "eligibility" as AgentType, time: "10:35 AM" },
      { name: "Form Auto-fill", status: "in_progress", agent: "Submission Agent", agentType: "submission" as AgentType, time: "In Progress" },
      { name: "Submit Application", status: "pending", agent: "User", agentType: "notification" as AgentType, time: "Pending" },
    ],
  },
  {
    id: "WF-002",
    name: "Startup India Registration",
    application: "APP-2024-002",
    status: "in_progress",
    progress: 40,
    currentStep: 2,
    totalSteps: 5,
    startedAt: "2024-02-08T14:00:00",
    steps: [
      { name: "Business Details", status: "completed", agent: "User", agentType: "research" as AgentType, time: "Feb 8, 2:00 PM" },
      { name: "Document Verification", status: "completed", agent: "OCR Agent", agentType: "ocr" as AgentType, time: "Feb 8, 2:05 PM" },
      { name: "DPIIT Recognition", status: "in_progress", agent: "Review Team", agentType: "reflection" as AgentType, time: "In Progress" },
      { name: "Tax Benefits", status: "pending", agent: "Submission Agent", agentType: "submission" as AgentType, time: "Pending" },
      { name: "Certificate Issue", status: "pending", agent: "System", agentType: "notification" as AgentType, time: "Pending" },
    ],
  },
  {
    id: "WF-003",
    name: "Aadhaar Verification Flow",
    application: null,
    status: "completed",
    progress: 100,
    currentStep: 4,
    totalSteps: 4,
    startedAt: "2024-02-05T09:00:00",
    completedAt: "2024-02-05T09:02:00",
    steps: [
      { name: "OTP Request", status: "completed", agent: "User", agentType: "research" as AgentType, time: "9:00 AM" },
      { name: "OTP Verification", status: "completed", agent: "UIDAI API", agentType: "ocr" as AgentType, time: "9:01 AM" },
      { name: "Data Fetch", status: "completed", agent: "OCR Agent", agentType: "ocr" as AgentType, time: "9:01 AM" },
      { name: "Profile Update", status: "completed", agent: "System", agentType: "notification" as AgentType, time: "9:02 AM" },
    ],
  },
  {
    id: "WF-004",
    name: "PMEGP Loan Application",
    application: "APP-2024-005",
    status: "failed",
    progress: 40,
    currentStep: 2,
    totalSteps: 6,
    startedAt: "2024-02-01T11:00:00",
    steps: [
      { name: "Application Start", status: "completed", agent: "User", agentType: "research" as AgentType, time: "Feb 1" },
      { name: "Document Check", status: "completed", agent: "OCR Agent", agentType: "ocr" as AgentType, time: "Feb 1" },
      { name: "Bank Verification", status: "failed", agent: "Bank API", agentType: "eligibility" as AgentType, time: "Feb 1", error: "Bank account details mismatch" },
      { name: "Eligibility", status: "skipped", agent: "Eligibility Agent", agentType: "eligibility" as AgentType, time: "-" },
      { name: "Submission", status: "skipped", agent: "User", agentType: "submission" as AgentType, time: "-" },
      { name: "Processing", status: "skipped", agent: "KVIC", agentType: "notification" as AgentType, time: "-" },
    ],
  },
]

const statusConfig = {
  completed: { label: "Completed", color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: Clock },
  pending: { label: "Pending", color: "bg-muted text-muted-foreground", icon: Clock },
  failed: { label: "Failed", color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: XCircle },
  skipped: { label: "Skipped", color: "bg-muted text-muted-foreground", icon: AlertCircle },
}

export default function WorkflowsPage() {
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>("WF-001")

  const stats = {
    active: workflows.filter(w => w.status === "in_progress").length,
    completed: workflows.filter(w => w.status === "completed").length,
    failed: workflows.filter(w => w.status === "failed").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Workflow Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Track AI-powered automation workflows and their progress
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/workflows/execute">
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Execute Workflow
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList>
          <TabsTrigger value="workflows">All Workflows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="agents">Agent Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {/* Workflows List */}
          <div className="space-y-4">
            {workflows.map((workflow, index) => {
              const status = statusConfig[workflow.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              const isExpanded = expandedWorkflow === workflow.id

              return (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      {/* Workflow Header */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <GitBranch className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                                <Badge className={status.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span>{workflow.id}</span>
                                {workflow.application && <span>Application: {workflow.application}</span>}
                                <span>Started: {new Date(workflow.startedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-foreground">
                                Step {workflow.currentStep} of {workflow.totalSteps}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={workflow.progress} className="w-24 h-2" />
                                <span className="text-sm text-muted-foreground">{workflow.progress}%</span>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Steps */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border"
                        >
                          <div className="p-6 bg-muted/30">
                            <h4 className="font-medium text-foreground mb-4">Workflow Steps</h4>
                            <div className="relative">
                              {/* Timeline line */}
                              <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-border" />
                              
                              <div className="space-y-4">
                                {workflow.steps.map((step, stepIndex) => {
                                  const stepStatus = statusConfig[step.status as keyof typeof statusConfig]
                                  const StepStatusIcon = stepStatus.icon
                                  const StepIcon = agentIcons[step.agentType] || GitBranch

                                  return (
                                    <div key={stepIndex} className="flex items-start gap-4 relative">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                        step.status === "completed" ? "bg-green-500" :
                                        step.status === "in_progress" ? agentColors[step.agentType] :
                                        step.status === "failed" ? "bg-red-500" :
                                        "bg-muted border-2 border-border"
                                      }`}>
                                        {step.status === "completed" ? (
                                          <CheckCircle className="w-5 h-5 text-white" />
                                        ) : step.status === "in_progress" ? (
                                          <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                          >
                                            <Clock className="w-5 h-5 text-white" />
                                          </motion.div>
                                        ) : step.status === "failed" ? (
                                          <XCircle className="w-5 h-5 text-white" />
                                        ) : (
                                          <StepIcon className="w-5 h-5 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div className="flex-1 pb-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h5 className="font-medium text-foreground">{step.name}</h5>
                                            <p className="text-sm text-muted-foreground">
                                              Agent: {step.agent} • {step.time}
                                            </p>
                                            {step.error && (
                                              <p className="text-sm text-red-500 mt-1">Error: {step.error}</p>
                                            )}
                                          </div>
                                          <Badge className={stepStatus.color} variant="outline">
                                            {stepStatus.label}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              {workflow.status === "failed" && (
                                <Button size="sm">
                                  <Play className="w-4 h-4 mr-2" />
                                  Retry Workflow
                                </Button>
                              )}
                              {workflow.status === "in_progress" && (
                                <Button size="sm" variant="secondary">
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  Continue
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WORKFLOW_TEMPLATES.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GitBranch className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="outline">{template.type.replace("_", " ")}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Pipeline Steps:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.steps.map((step, i) => {
                          const Icon = agentIcons[step.agentType]
                          return (
                            <Badge key={i} variant="secondary" className="gap-1">
                              <Icon className="w-3 h-3" />
                              {step.name}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                    <Link href="/dashboard/workflows/execute">
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-2" />
                        Use Template
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Agent Pipeline Architecture</CardTitle>
              <CardDescription>
                Visual representation of the AI agent orchestration system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative py-8">
                {/* Pipeline Visualization */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                  {(["research", "ocr", "eligibility", "reflection", "submission", "notification"] as AgentType[]).map((agentType, index) => {
                    const config = AGENT_CONFIGS[agentType]
                    const Icon = agentIcons[agentType]
                    return (
                      <div key={agentType} className="flex items-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${agentColors[agentType]} flex items-center justify-center shadow-lg`}>
                            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                          </div>
                          <p className="text-xs md:text-sm text-center mt-2 font-medium text-foreground max-w-20 md:max-w-24">
                            {config.name.replace(" Agent", "")}
                          </p>
                        </motion.div>
                        {index < 5 && (
                          <ArrowRight className="w-6 h-6 text-muted-foreground mx-2 hidden md:block" />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Agent Details */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                  {(["research", "ocr", "eligibility", "reflection", "submission", "notification"] as AgentType[]).map((agentType) => {
                    const config = AGENT_CONFIGS[agentType]
                    const Icon = agentIcons[agentType]
                    return (
                      <Card key={agentType} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl ${agentColors[agentType]} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{config.name}</h4>
                              <p className="text-xs text-muted-foreground">Timeout: {config.timeoutMs / 1000}s</p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{config.description}</p>
                          <div className="space-y-1">
                            {config.capabilities.slice(0, 3).map((cap, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {cap}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
