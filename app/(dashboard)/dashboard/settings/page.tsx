"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { 
  Settings, 
  Bell, 
  Globe, 
  Moon, 
  Sun,
  Monitor,
  Lock,
  Shield,
  HelpCircle,
  FileText,
  Mail,
  MessageSquare,
  Smartphone,
  CreditCard,
  Download,
  Trash2,
  LogOut,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("en")
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    schemes: true,
    documents: true,
    applications: true,
    marketing: false
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Settings</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Navigation */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardContent className="p-2">
              <nav className="space-y-1">
                {[
                  { icon: Bell, label: "Notifications", active: true },
                  { icon: Globe, label: "Language & Region", active: false },
                  { icon: Moon, label: "Appearance", active: false },
                  { icon: Shield, label: "Privacy & Security", active: false },
                  { icon: CreditCard, label: "Billing", active: false },
                  { icon: HelpCircle, label: "Help & Support", active: false }
                ].map((item, index) => (
                  <Button 
                    key={index}
                    variant={item.active ? "secondary" : "ghost"} 
                    className="w-full justify-start"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Download Documents
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out All Devices
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out all devices?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out from all devices except this one. You&apos;ll need to sign in again on those devices.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Log Out All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how GovEase AI looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={theme} 
                onValueChange={setTheme}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: "light", icon: Sun, label: "Light" },
                  { value: "dark", icon: Moon, label: "Dark" },
                  { value: "system", icon: Monitor, label: "System" }
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all hover:border-primary/50 ${
                      theme === option.value ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    <option.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Language & Region
              </CardTitle>
              <CardDescription>
                Set your preferred language and regional settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                      <SelectItem value="mr">Marathi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="gu">Gujarati</SelectItem>
                      <SelectItem value="kn">Kannada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="IST">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Channels</h4>
                <div className="space-y-3">
                  {[
                    { key: "email", icon: Mail, label: "Email Notifications", desc: "Receive updates via email" },
                    { key: "push", icon: Bell, label: "Push Notifications", desc: "Browser push notifications" },
                    { key: "sms", icon: Smartphone, label: "SMS Notifications", desc: "Important alerts via SMS" }
                  ].map((channel) => (
                    <div key={channel.key} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <channel.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{channel.label}</p>
                          <p className="text-xs text-muted-foreground">{channel.desc}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={notifications[channel.key as keyof typeof notifications] as boolean}
                        onCheckedChange={(checked) => handleNotificationChange(channel.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="space-y-3">
                  {[
                    { key: "schemes", label: "Scheme Updates", desc: "New schemes and eligibility alerts" },
                    { key: "documents", label: "Document Alerts", desc: "Verification status and expiry reminders" },
                    { key: "applications", label: "Application Status", desc: "Updates on your applications" },
                    { key: "marketing", label: "News & Updates", desc: "GovEase AI news and features" }
                  ].map((type) => (
                    <div key={type.key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{type.label}</p>
                        <p className="text-xs text-muted-foreground">{type.desc}</p>
                      </div>
                      <Switch 
                        checked={notifications[type.key as keyof typeof notifications] as boolean}
                        onCheckedChange={(checked) => handleNotificationChange(type.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your privacy and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Login Alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified of new sign-ins</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Data Sharing</p>
                  <p className="text-xs text-muted-foreground">Share data with government portals</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-base text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                <div>
                  <p className="text-sm font-medium">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account 
                        and remove all your data including documents, applications, and history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
