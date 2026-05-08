"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Plus,
  ArrowRight,
  Calendar,
  Building2,
} from "lucide-react"

const applications = [
  {
    id: "APP-2024-001",
    scheme: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture",
    status: "approved",
    submittedAt: "2024-01-15",
    reviewedAt: "2024-01-20",
    amount: "6,000",
  },
  {
    id: "APP-2024-002",
    scheme: "Startup India Registration",
    ministry: "Ministry of Commerce",
    status: "under_review",
    submittedAt: "2024-02-01",
    reviewedAt: null,
    amount: null,
  },
  {
    id: "APP-2024-003",
    scheme: "PMEGP Loan Scheme",
    ministry: "Ministry of MSME",
    status: "submitted",
    submittedAt: "2024-02-10",
    reviewedAt: null,
    amount: "10,00,000",
  },
  {
    id: "APP-2024-004",
    scheme: "Digital India Internship",
    ministry: "Ministry of Electronics & IT",
    status: "rejected",
    submittedAt: "2024-01-05",
    reviewedAt: "2024-01-12",
    amount: null,
  },
  {
    id: "APP-2024-005",
    scheme: "Ayushman Bharat Card",
    ministry: "Ministry of Health",
    status: "draft",
    submittedAt: null,
    reviewedAt: null,
    amount: "5,00,000",
  },
]

const statusConfig = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: FileText },
  submitted: { label: "Submitted", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400", icon: Clock },
  under_review: { label: "Under Review", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: AlertCircle },
  approved: { label: "Approved", color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: XCircle },
}

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.scheme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: applications.length,
    approved: applications.filter(a => a.status === "approved").length,
    pending: applications.filter(a => ["submitted", "under_review"].includes(a.status)).length,
    draft: applications.filter(a => a.status === "draft").length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your scheme applications</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Applications", value: stats.total, icon: FileText, color: "text-primary" },
          { label: "Approved", value: stats.approved, icon: CheckCircle, color: "text-green-500" },
          { label: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-500" },
          { label: "Drafts", value: stats.draft, icon: AlertCircle, color: "text-muted-foreground" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
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

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No applications found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try adjusting your search or filters" : "Start by applying to a government scheme"}
                </p>
                <Button>
                  Browse Schemes
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredApplications.map((app, index) => {
              const status = statusConfig[app.status as keyof typeof statusConfig]
              const StatusIcon = status.icon
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-foreground truncate">{app.scheme}</h3>
                                <Badge className={status.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{app.ministry}</p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {app.id}
                                </span>
                                {app.submittedAt && (
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                                  </span>
                                )}
                                {app.amount && (
                                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    Benefit: ₹{app.amount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          {app.status === "approved" && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Certificate
                            </Button>
                          )}
                          {app.status === "draft" && (
                            <Button size="sm">
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Active Applications</h3>
              <p className="text-muted-foreground">Applications that are currently being processed</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Completed Applications</h3>
              <p className="text-muted-foreground">Applications that have been approved or rejected</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
