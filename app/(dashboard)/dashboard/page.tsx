"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Search,
  Building2,
  Upload,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Bell,
  Calendar,
  Bot,
} from "lucide-react"

const stats = [
  {
    title: "Eligible Schemes",
    value: "12",
    change: "+3 new",
    icon: Search,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Applications",
    value: "5",
    change: "2 pending",
    icon: FileText,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    title: "Documents",
    value: "8",
    change: "All verified",
    icon: Upload,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Startup Progress",
    value: "60%",
    change: "Step 3 of 5",
    icon: Building2,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

const recentApplications = [
  {
    id: 1,
    name: "PM Kisan Samman Nidhi",
    status: "approved",
    date: "Dec 15, 2024",
    amount: "₹6,000/year",
  },
  {
    id: 2,
    name: "Ayushman Bharat PMJAY",
    status: "pending",
    date: "Dec 10, 2024",
    amount: "₹5 Lakh coverage",
  },
  {
    id: 3,
    name: "PM SVANidhi",
    status: "review",
    date: "Dec 5, 2024",
    amount: "₹10,000 loan",
  },
]

const recommendations = [
  {
    title: "Complete your profile",
    description: "Add income details to unlock 5 more schemes",
    priority: "high",
    action: "Update Profile",
  },
  {
    title: "Upload PAN Card",
    description: "Required for financial scheme applications",
    priority: "medium",
    action: "Upload Now",
  },
  {
    title: "Review new scheme",
    description: "Startup India scheme matches your profile",
    priority: "low",
    action: "View Scheme",
  },
]

const upcomingDeadlines = [
  { name: "PM Kisan Registration", date: "Dec 31, 2024", daysLeft: 15 },
  { name: "GST Filing", date: "Jan 10, 2025", daysLeft: 25 },
  { name: "Document Renewal", date: "Jan 15, 2025", daysLeft: 30 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-500/10 text-green-500"
    case "pending":
      return "bg-yellow-500/10 text-yellow-500"
    case "review":
      return "bg-blue-500/10 text-blue-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500/10 text-red-500"
    case "medium":
      return "bg-yellow-500/10 text-yellow-500"
    case "low":
      return "bg-green-500/10 text-green-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function DashboardPage() {
  const { getDisplayName } = useUser()
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {getDisplayName()}
            </h1>
            <p className="text-muted-foreground mt-1">
              {"Here's what's happening with your government services today"}
            </p>
          </div>
          <Button asChild className="w-fit">
            <Link href="/dashboard/chat">
              <Bot className="w-4 h-4 mr-2" />
              Talk to AI Assistant
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`p-2 md:p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your latest scheme applications</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/applications">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{app.name}</p>
                        <p className="text-sm text-muted-foreground">{app.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(app.status)}>
                        {app.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {app.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {app.status === "review" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {app.status}
                      </Badge>
                      <p className="text-sm font-medium text-foreground mt-1">{app.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <CardTitle>AI Recommendations</CardTitle>
              </div>
              <CardDescription>Personalized suggestions for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-foreground text-sm">{rec.title}</p>
                      <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      {rec.action}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                <CardTitle>Upcoming Deadlines</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium text-foreground text-sm">{deadline.name}</p>
                        <p className="text-xs text-muted-foreground">{deadline.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {deadline.daysLeft} days left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
                  <Link href="/dashboard/schemes">
                    <Search className="w-5 h-5 text-primary" />
                    <span className="text-sm">Find Schemes</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
                  <Link href="/dashboard/documents">
                    <Upload className="w-5 h-5 text-secondary" />
                    <span className="text-sm">Upload Docs</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
                  <Link href="/dashboard/startup">
                    <Building2 className="w-5 h-5 text-accent" />
                    <span className="text-sm">Start Business</span>
                  </Link>
                </Button>
                <Button variant="outline" asChild className="h-auto py-4 flex flex-col items-center gap-2">
                  <Link href="/dashboard/chat">
                    <Bot className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Ask AI</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
