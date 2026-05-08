"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useUser } from "@/hooks/use-user"
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Search,
  Building2,
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Upload,
  MapPin,
  Bot,
  GitBranch,
  Shield,
} from "lucide-react"

const mainNavItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "AI Assistant",
    href: "/dashboard/chat",
    icon: MessageSquare,
    badge: "AI",
  },
  {
    label: "AI Agents",
    href: "/dashboard/agents",
    icon: Bot,
    badge: "New",
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: Upload,
  },
  {
    label: "Schemes",
    href: "/dashboard/schemes",
    icon: Search,
    badge: "12",
  },
  {
    label: "Applications",
    href: "/dashboard/applications",
    icon: FileText,
  },
  {
    label: "Business Setup",
    href: "/dashboard/startup",
    icon: Building2,
  },
  {
    label: "Workflows",
    href: "/dashboard/workflows",
    icon: GitBranch,
  },
  {
    label: "Gov Offices",
    href: "/dashboard/offices",
    icon: MapPin,
  },
]

const bottomNavItems = [
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: "3",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
  {
    label: "Admin",
    href: "/dashboard/admin",
    icon: Shield,
  },
  {
    label: "Help Center",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, getInitials, getDisplayName } = useUser()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 bottom-0 z-40 bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden"
              >
                GovEase<span className="text-primary">AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : "outline"}
                          className={cn(
                            "ml-auto shrink-0",
                            isActive && "bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground border-none"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-sidebar-border">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between flex-1 overflow-hidden"
                    >
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )
        })}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-sidebar-border">
        <div
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0 overflow-hidden"
              >
                <p className="font-medium text-sidebar-foreground truncate">{getDisplayName()}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email || "Loading..."}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0 text-sidebar-foreground hover:bg-sidebar-border"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
