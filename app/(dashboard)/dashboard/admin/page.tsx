"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Database,
  Bot,
  TrendingUp,
  TrendingDown,
  Eye,
  Settings,
  RefreshCw,
  FileText,
} from "lucide-react"

const systemMetrics = [
  { label: "API Uptime", value: "99.97%", trend: "+0.02%", icon: Server, status: "healthy" },
  { label: "Database Load", value: "42%", trend: "-5%", icon: Database, status: "healthy" },
  { label: "AI Agent Status", value: "4/5 Active", trend: "stable", icon: Bot, status: "warning" },
  { label: "Avg Response Time", value: "145ms", trend: "-12ms", icon: Activity, status: "healthy" },
]

const recentAlerts = [
  {
    type: "warning",
    title: "High API latency detected",
    description: "Response times increased by 20% in the last hour",
    time: "15 mins ago",
  },
  {
    type: "info",
    title: "Scheduled maintenance",
    description: "Database optimization scheduled for tonight at 2 AM",
    time: "1 hour ago",
  },
  {
    type: "success",
    title: "Security scan completed",
    description: "No vulnerabilities detected in the latest scan",
    time: "3 hours ago",
  },
  {
    type: "error",
    title: "Decision Agent offline",
    description: "Agent failed health check - auto-restart initiated",
    time: "5 hours ago",
  },
]

const userActivity = [
  { label: "Total Users", value: "52,847", change: "+1,234", trend: "up" },
  { label: "Active Today", value: "8,421", change: "+567", trend: "up" },
  { label: "Applications Today", value: "1,892", change: "+234", trend: "up" },
  { label: "Documents Processed", value: "4,567", change: "-123", trend: "down" },
]

const agentPerformance = [
  { name: "Document Verification", success: 98.5, tasks: 2340, avgTime: "2.3s" },
  { name: "Eligibility Checker", success: 96.2, tasks: 1890, avgTime: "1.8s" },
  { name: "Form Assistant", success: 94.8, tasks: 3456, avgTime: "3.5s" },
  { name: "Notification Agent", success: 99.1, tasks: 8901, avgTime: "0.5s" },
  { name: "Decision Support", success: 92.3, tasks: 567, avgTime: "4.2s" },
]

export default function AdminPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">System monitoring and administration controls</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${
                    metric.status === "healthy" ? "bg-green-500/10" :
                    metric.status === "warning" ? "bg-yellow-500/10" : "bg-red-500/10"
                  }`}>
                    <metric.icon className={`w-5 h-5 ${
                      metric.status === "healthy" ? "text-green-500" :
                      metric.status === "warning" ? "text-yellow-500" : "text-red-500"
                    }`} />
                  </div>
                  <Badge variant="outline" className={`text-xs ${
                    metric.status === "healthy" ? "text-green-600 border-green-200" :
                    metric.status === "warning" ? "text-yellow-600 border-yellow-200" : "text-red-600 border-red-200"
                  }`}>
                    {metric.status}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span className={`text-xs ${metric.trend.startsWith('+') || metric.trend.startsWith('-') ? (metric.trend.startsWith('+') ? 'text-green-500' : 'text-red-500') : 'text-muted-foreground'}`}>
                    {metric.trend}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Activity
              </CardTitle>
              <CardDescription>Platform usage statistics for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {userActivity.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <span className={`flex items-center text-xs ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      alert.type === "success" ? "bg-green-500/10" :
                      alert.type === "warning" ? "bg-yellow-500/10" :
                      alert.type === "error" ? "bg-red-500/10" : "bg-blue-500/10"
                    }`}>
                      {alert.type === "success" ? <CheckCircle className="w-5 h-5 text-green-500" /> :
                       alert.type === "warning" ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                       alert.type === "error" ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                       <Clock className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h4 className="font-medium text-foreground">{alert.title}</h4>
                        <span className="text-xs text-muted-foreground shrink-0">{alert.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">User Management</h3>
              <p className="text-muted-foreground mb-4">
                Manage user accounts, roles, and permissions
              </p>
              <Button>Open User Manager</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                AI Agent Performance
              </CardTitle>
              <CardDescription>Real-time performance metrics for all agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {agentPerformance.map((agent) => (
                  <div key={agent.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-foreground">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {agent.tasks.toLocaleString()} tasks • {agent.avgTime} avg
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-bold ${agent.success >= 95 ? 'text-green-500' : agent.success >= 90 ? 'text-yellow-500' : 'text-red-500'}`}>
                          {agent.success}%
                        </span>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                    <Progress value={agent.success} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Alert Configuration</h3>
              <p className="text-muted-foreground mb-4">
                Configure alert thresholds and notification settings
              </p>
              <Button>Configure Alerts</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
