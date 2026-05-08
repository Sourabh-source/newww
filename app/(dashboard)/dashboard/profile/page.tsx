"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useUser } from "@/hooks/use-user"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Edit2,
  Camera,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Building2,
  CreditCard,
  Lock,
  Bell,
  Globe,
  Smartphone
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const defaultProfile = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  aadhaar: "",
  pan: "",
  profileCompletion: 30
}

const linkedDocuments = [
  { name: "Aadhaar Card", status: "verified", number: "XXXX XXXX 4567" },
  { name: "PAN Card", status: "verified", number: "ABCPK1234A" },
  { name: "Driving License", status: "pending", number: "KA-01-2015-123456" },
  { name: "Voter ID", status: "not_linked", number: "-" }
]

const recentActivity = [
  { action: "Applied for PM-KISAN Scheme", date: "2 days ago", status: "pending" },
  { action: "Uploaded PAN Card", date: "5 days ago", status: "completed" },
  { action: "Started GST Registration", date: "1 week ago", status: "in_progress" },
  { action: "Verified Aadhaar Card", date: "2 weeks ago", status: "completed" },
  { action: "Created Account", date: "1 month ago", status: "completed" }
]

export default function ProfilePage() {
  const { user, profile, loading, updateProfile, getInitials } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(defaultProfile)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize form data from user/profile when available
  useEffect(() => {
    if (user || profile) {
      setFormData({
        name: profile?.full_name || user?.user_metadata?.full_name || "",
        email: user?.email || "",
        phone: profile?.phone || user?.user_metadata?.phone || "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        aadhaar: profile?.aadhaar_verified ? "XXXX XXXX Verified" : "",
        pan: "",
        profileCompletion: profile?.full_name && profile?.phone ? 60 : 30
      })
    }
  }, [user, profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile({
        full_name: formData.name,
        phone: formData.phone,
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset to original values from user/profile
    if (user || profile) {
      setFormData({
        name: profile?.full_name || user?.user_metadata?.full_name || "",
        email: user?.email || "",
        phone: profile?.phone || user?.user_metadata?.phone || "",
        dob: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        aadhaar: profile?.aadhaar_verified ? "XXXX XXXX Verified" : "",
        pan: "",
        profileCompletion: profile?.full_name && profile?.phone ? 60 : 30
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-balance">My Profile</h1>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Profile Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={formData.name} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold">{formData.name}</h2>
              <p className="text-sm text-muted-foreground">{formData.email}</p>
              <Badge className="mt-2 bg-secondary/10 text-secondary border-secondary/20">
                <Shield className="h-3 w-3 mr-1" />
                Verified User
              </Badge>

              <div className="w-full mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Profile Completion</span>
                  <span className="font-medium">{formData.profileCompletion}%</span>
                </div>
                <Progress value={formData.profileCompletion} className="h-2" />
                {formData.profileCompletion < 100 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete your profile to unlock all features
                  </p>
                )}
              </div>

              <div className="w-full mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{formData.city}, {formData.state}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details used for government services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input 
                        id="dob"
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange("gender", value)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-4">Address</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input 
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Select 
                          value={formData.state}
                          onValueChange={(value) => handleInputChange("state", value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Karnataka", "Maharashtra", "Delhi", "Tamil Nadu", "Telangana", "Gujarat"].map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input 
                          id="pincode"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange("pincode", e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents */}
            <TabsContent value="documents" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Linked Documents</CardTitle>
                  <CardDescription>
                    Government ID documents linked to your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {linkedDocuments.map((doc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.number}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.status === "verified" && (
                            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {doc.status === "pending" && (
                            <Badge variant="outline" className="border-warning/50 text-warning">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {doc.status === "not_linked" && (
                            <Button variant="outline" size="sm">
                              Link Now
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    <FileText className="h-4 w-4 mr-2" />
                    Link More Documents
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Lock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Password</p>
                        <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-info" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Login Notifications</p>
                        <p className="text-xs text-muted-foreground">Get notified of new logins</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Active Sessions</p>
                        <p className="text-xs text-muted-foreground">2 devices currently logged in</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity */}
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and application history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative pl-10"
                        >
                          <div className={`absolute left-2.5 h-3 w-3 rounded-full ${
                            activity.status === "completed" 
                              ? "bg-secondary" 
                              : activity.status === "in_progress" 
                                ? "bg-primary" 
                                : "bg-warning"
                          }`} />
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.date}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                activity.status === "completed" 
                                  ? "border-secondary/50 text-secondary" 
                                  : activity.status === "in_progress" 
                                    ? "border-primary/50 text-primary" 
                                    : "border-warning/50 text-warning"
                              }`}
                            >
                              {activity.status === "completed" && "Completed"}
                              {activity.status === "in_progress" && "In Progress"}
                              {activity.status === "pending" && "Pending"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-6">
                    View Full History
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">12</p>
                <p className="text-xs text-muted-foreground">Applications</p>
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
                <p className="text-2xl font-semibold">8</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">2</p>
                <p className="text-xs text-muted-foreground">Businesses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">INR 2.5L</p>
                <p className="text-xs text-muted-foreground">Benefits Received</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
