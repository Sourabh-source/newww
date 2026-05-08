"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  Check, 
  CheckCheck,
  Clock,
  FileText,
  AlertCircle,
  CheckCircle2,
  Info,
  Trash2,
  Filter,
  MoreHorizontal,
  Sparkles,
  Building2,
  Shield,
  CreditCard,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NotificationType = "success" | "warning" | "info" | "alert"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  category: "schemes" | "documents" | "applications" | "system"
  actionUrl?: string
  actionLabel?: string
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Scheme Application Approved",
    message: "Your application for PM-KISAN Samman Nidhi has been approved. Benefits will be credited to your account within 7 days.",
    timestamp: "2 hours ago",
    read: false,
    category: "schemes",
    actionUrl: "/dashboard/schemes",
    actionLabel: "View Details"
  },
  {
    id: "2",
    type: "info",
    title: "Document Verification Complete",
    message: "Your Aadhaar card has been successfully verified and linked to your GovEase profile.",
    timestamp: "5 hours ago",
    read: false,
    category: "documents"
  },
  {
    id: "3",
    type: "warning",
    title: "Action Required: Missing Document",
    message: "Your PAN card is required to complete the GST registration process. Please upload it to proceed.",
    timestamp: "1 day ago",
    read: false,
    category: "documents",
    actionUrl: "/dashboard/documents",
    actionLabel: "Upload Now"
  },
  {
    id: "4",
    type: "alert",
    title: "Application Deadline Approaching",
    message: "The deadline for Startup India Registration is in 3 days. Complete your application to avoid missing out.",
    timestamp: "1 day ago",
    read: true,
    category: "applications",
    actionUrl: "/dashboard/startup",
    actionLabel: "Continue Application"
  },
  {
    id: "5",
    type: "success",
    title: "Business Registration Complete",
    message: "Congratulations! Your Private Limited company has been successfully registered. CIN: U72900MH2024PTC123456",
    timestamp: "2 days ago",
    read: true,
    category: "applications"
  },
  {
    id: "6",
    type: "info",
    title: "New Scheme Recommendation",
    message: "Based on your profile, you may be eligible for the MSME Credit Guarantee Scheme. Check your eligibility now.",
    timestamp: "3 days ago",
    read: true,
    category: "schemes",
    actionUrl: "/dashboard/schemes",
    actionLabel: "Check Eligibility"
  },
  {
    id: "7",
    type: "info",
    title: "System Maintenance Scheduled",
    message: "GovEase AI will undergo scheduled maintenance on Sunday, 2 AM - 4 AM IST. Some services may be temporarily unavailable.",
    timestamp: "4 days ago",
    read: true,
    category: "system"
  },
  {
    id: "8",
    type: "success",
    title: "GST Registration Approved",
    message: "Your GST registration has been approved. GSTIN: 27AABCU9603R1ZM. You can now start issuing GST invoices.",
    timestamp: "5 days ago",
    read: true,
    category: "applications"
  }
]

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-secondary" />
    case "warning":
      return <AlertCircle className="h-5 w-5 text-warning" />
    case "info":
      return <Info className="h-5 w-5 text-primary" />
    case "alert":
      return <Clock className="h-5 w-5 text-destructive" />
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "schemes":
      return <Sparkles className="h-4 w-4" />
    case "documents":
      return <FileText className="h-4 w-4" />
    case "applications":
      return <Building2 className="h-4 w-4" />
    case "system":
      return <Shield className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    return n.category === activeTab
  })

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.read))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="bg-primary text-primary-foreground">{unreadCount} new</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearAllRead}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear read notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{notifications.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {notifications.filter(n => n.type === "success").length}
                </p>
                <p className="text-xs text-muted-foreground">Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {notifications.filter(n => n.type === "warning").length}
                </p>
                <p className="text-xs text-muted-foreground">Action Needed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {notifications.filter(n => n.type === "alert").length}
                </p>
                <p className="text-xs text-muted-foreground">Urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="schemes">Schemes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={`p-4 rounded-lg border transition-all hover:border-primary/30 ${
                      notification.read ? "bg-background" : "bg-primary/5 border-primary/20"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge variant="outline" className="text-xs hidden sm:flex">
                              {getCategoryIcon(notification.category)}
                              <span className="ml-1 capitalize">{notification.category}</span>
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </span>
                          {notification.actionUrl && (
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              {notification.actionLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-medium">No notifications</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === "unread" 
                    ? "You're all caught up!" 
                    : "No notifications in this category"}
                </p>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Sparkles, label: "Scheme Updates", desc: "New schemes & eligibility alerts" },
              { icon: FileText, label: "Document Status", desc: "Verification & expiry reminders" },
              { icon: Building2, label: "Applications", desc: "Status updates & deadlines" },
              { icon: CreditCard, label: "Payments", desc: "Transaction & refund alerts" }
            ].map((pref, index) => (
              <div key={index} className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <pref.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{pref.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
