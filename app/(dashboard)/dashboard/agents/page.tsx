"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  Bot,
  FileCheck,
  UserCheck,
  FileText,
  Bell,
  Brain,
  Zap,
  Activity,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Shield,
  Eye,
  ArrowRight,
  Search,
  Send,
} from "lucide-react"
import { AGENT_CONFIGS, AgentType } from "@/lib/agents/types"

const agentIcons: Record<AgentType, React.ElementType> = {
  research: Search,
  eligibility: UserCheck,
  ocr: FileCheck,
  submission: Send,
  notification: Bell,
  reflection: Brain,
}

const agentColors: Record<AgentType, { bg: string; text: string }> = {
  research: { bg: "bg-blue-500", text: "text-blue-500" },
  eligibility: { bg: "bg-green-500", text: "text-green-500" },
  ocr: { bg: "bg-purple-500", text: "text-purple-500" },
  submission: { bg: "bg-orange-500", text: "text-orange-500" },
  notification: { bg: "bg-pink-500", text: "text-pink-500" },
  reflection: { bg: "bg-cyan-500", text: "text-cyan-500" },
}

// Mock performance metrics
const agentMetrics: Record<AgentType, { tasksCompleted: number; accuracy: number; avgTime: string; status: "active" | "idle" }> = {
  research: { tasksCompleted: 234, accuracy: 94.5, avgTime: "2.1s", status: "active" },
  eligibility: { tasksCompleted: 189, accuracy: 96.2, avgTime: "1.8s", status: "active" },
  ocr: { tasksCompleted: 312, accuracy: 98.1, avgTime: "3.2s", status: "active" },
  submission: { tasksCompleted: 145, accuracy: 97.5, avgTime: "4.5s", status: "active" },
  notification: { tasksCompleted: 567, accuracy: 99.8, avgTime: "0.3s", status: "active" },
  reflection: { tasksCompleted: 78, accuracy: 91.3, avgTime: "2.8s", status: "idle" },
}

const recentActivity = [
  {
    agent: "Research Agent",
    agentType: "research" as AgentType,
    action: "Found 5 matching schemes",
    status: "success",
    time: "2 mins ago",
    details: "Searched 500+ schemes, filtered by farmer criteria in Maharashtra",
  },
  {
    agent: "OCR Document Agent",
    agentType: "ocr" as AgentType,
    action: "Verified Aadhaar Card",
    status: "success",
    time: "5 mins ago",
    details: "Extracted 12 data fields with 99% confidence",
  },
  {
    agent: "Eligibility Agent",
    agentType: "eligibility" as AgentType,
    action: "Checked PM-KISAN eligibility",
    status: "success",
    time: "8 mins ago",
    details: "User meets all 5 criteria requirements",
  },
  {
    agent: "Reflection Agent",
    agentType: "reflection" as AgentType,
    action: "Reviewed workflow decisions",
    status: "success",
    time: "10 mins ago",
    details: "All decisions validated, no corrections needed",
  },
  {
    agent: "Submission Agent",
    agentType: "submission" as AgentType,
    action: "Submitted PMEGP application",
    status: "success",
    time: "15 mins ago",
    details: "Application ID: APP-2024-0156",
  },
  {
    agent: "Notification Agent",
    agentType: "notification" as AgentType,
    action: "Sent status update",
    status: "success",
    time: "15 mins ago",
    details: "Email and SMS notifications delivered",
  },
  {
    agent: "OCR Document Agent",
    agentType: "ocr" as AgentType,
    action: "Processed Income Certificate",
    status: "warning",
    time: "20 mins ago",
    details: "Low confidence on income amount - manual review suggested",
  },
]

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null)

  const agents = (Object.keys(AGENT_CONFIGS) as AgentType[]).map((agentType) => ({
    ...AGENT_CONFIGS[agentType],
    ...agentMetrics[agentType],
    icon: agentIcons[agentType],
    colors: agentColors[agentType],
  }))

  const activeAgents = agents.filter(a => a.status === "active").length
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0)
  const avgAccuracy = (agents.reduce((sum, a) => sum + a.accuracy, 0) / agents.length).toFixed(1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Agent Center</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your AI-powered automation agents
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </Button>
          <Link href="/dashboard/workflows/execute">
            <Button>
              <Zap className="w-4 h-4 mr-2" />
              Run Workflow
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: activeAgents, total: agents.length, icon: Bot, color: "text-green-500" },
          { label: "Tasks Completed", value: totalTasks.toLocaleString(), icon: CheckCircle, color: "text-blue-500" },
          { label: "Average Accuracy", value: `${avgAccuracy}%`, icon: Activity, color: "text-purple-500" },
          { label: "Time Saved", value: "24.5 hrs", icon: Clock, color: "text-orange-500" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                      {stat.total && <span className="text-sm font-normal text-muted-foreground">/{stat.total}</span>}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="agents">All Agents</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {agents.map((agent, index) => {
              const Icon = agent.icon
              const isSelected = selectedAgent === agent.id

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`hover:shadow-md transition-all cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => setSelectedAgent(isSelected ? null : agent.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-2xl ${agent.colors.bg}/10 flex items-center justify-center shrink-0`}>
                            <Icon className={`w-7 h-7 ${agent.colors.text}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-foreground">{agent.name}</h3>
                              <Badge variant={agent.status === "active" ? "default" : "secondary"} className={agent.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : ""}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${agent.status === "active" ? "bg-green-500" : "bg-muted-foreground"}`} />
                                {agent.status === "active" ? "Active" : "Idle"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {agent.tasksCompleted} tasks
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Activity className="w-4 h-4 text-blue-500" />
                                {agent.accuracy}% accuracy
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4 text-orange-500" />
                                {agent.avgTime} avg
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Logs
                          </Button>
                          <Button size="sm" variant={agent.status === "active" ? "secondary" : "default"}>
                            {agent.status === "active" ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-border"
                          >
                            <div className="grid md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-3">Capabilities</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                  {agent.capabilities.map((cap, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                                      {cap}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-3">Performance (Last 7 days)</h4>
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Success Rate</span>
                                      <span className="font-medium text-foreground">{agent.accuracy}%</span>
                                    </div>
                                    <Progress value={agent.accuracy} className="h-2" />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-muted-foreground">Utilization</span>
                                      <span className="font-medium text-foreground">{Math.round(60 + Math.random() * 30)}%</span>
                                    </div>
                                    <Progress value={60 + Math.random() * 30} className="h-2" />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-3">Configuration</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Max Retries</span>
                                    <span className="text-foreground">{agent.maxRetries}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Timeout</span>
                                    <span className="text-foreground">{agent.timeoutMs / 1000}s</span>
                                  </div>
                                  {agent.dependencies && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Dependencies</span>
                                      <span className="text-foreground">{agent.dependencies.join(", ")}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Agent Activity</CardTitle>
              <CardDescription>Real-time log of agent actions and decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = agentIcons[activity.agentType]
                  const colors = agentColors[activity.agentType]
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}/10`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <h4 className="font-medium text-foreground">{activity.action}</h4>
                          <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{activity.agent}</p>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={activity.status === "success" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"}
                      >
                        {activity.status}
                      </Badge>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance Comparison</CardTitle>
                <CardDescription>Accuracy and task completion metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agents.map((agent) => {
                    const Icon = agent.icon
                    return (
                      <div key={agent.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg ${agent.colors.bg}/10 flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${agent.colors.text}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground">{agent.name.replace(" Agent", "")}</span>
                            <span className="text-muted-foreground">{agent.accuracy}%</span>
                          </div>
                          <Progress value={agent.accuracy} className="h-2" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Workflow Integration</CardTitle>
                <CardDescription>How agents work together in workflows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h4 className="font-medium text-foreground mb-3">Scheme Application Flow</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Research", "OCR", "Eligibility", "Reflection", "Submission", "Notification"].map((name, i) => (
                      <Badge key={name} variant="outline" className="gap-1">
                        <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">{i + 1}</span>
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <h4 className="font-medium text-foreground mb-3">Document Verification Flow</h4>
                  <div className="flex flex-wrap gap-2">
                    {["OCR", "Reflection", "Notification"].map((name, i) => (
                      <Badge key={name} variant="outline" className="gap-1">
                        <span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">{i + 1}</span>
                        {name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Link href="/dashboard/workflows/execute">
                  <Button className="w-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Test Agent Pipeline
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
