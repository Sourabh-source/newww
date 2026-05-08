"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  Trash2,
  Shield,
  Sparkles,
  X,
  CreditCard,
  User,
  Home,
  GraduationCap,
  Banknote,
  FileCheck,
  Lock,
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  category: string
  status: "verified" | "pending" | "failed"
  uploadDate: string
  expiryDate?: string
  extractedData?: Record<string, string>
  size: string
  icon: typeof FileText
}

const documentCategories = [
  { id: "all", label: "All Documents", icon: FileText },
  { id: "identity", label: "Identity", icon: User },
  { id: "address", label: "Address", icon: Home },
  { id: "financial", label: "Financial", icon: Banknote },
  { id: "education", label: "Education", icon: GraduationCap },
]

const documents: Document[] = [
  {
    id: "1",
    name: "Aadhaar Card",
    type: "PDF",
    category: "identity",
    status: "verified",
    uploadDate: "Dec 10, 2024",
    extractedData: {
      "Full Name": "Rahul Sharma",
      "Aadhaar Number": "XXXX-XXXX-1234",
      "DOB": "15/03/1990",
      "Address": "123, MG Road, Delhi",
    },
    size: "1.2 MB",
    icon: CreditCard,
  },
  {
    id: "2",
    name: "PAN Card",
    type: "PDF",
    category: "financial",
    status: "verified",
    uploadDate: "Dec 8, 2024",
    extractedData: {
      "Full Name": "Rahul Sharma",
      "PAN Number": "ABCDE1234F",
      "DOB": "15/03/1990",
    },
    size: "856 KB",
    icon: CreditCard,
  },
  {
    id: "3",
    name: "Income Certificate",
    type: "PDF",
    category: "financial",
    status: "pending",
    uploadDate: "Dec 12, 2024",
    size: "2.1 MB",
    icon: FileText,
  },
  {
    id: "4",
    name: "Address Proof",
    type: "PDF",
    category: "address",
    status: "verified",
    uploadDate: "Dec 5, 2024",
    extractedData: {
      "Type": "Utility Bill",
      "Address": "123, MG Road, Delhi",
      "Issue Date": "Nov 2024",
    },
    size: "1.5 MB",
    icon: Home,
  },
  {
    id: "5",
    name: "Bank Statement",
    type: "PDF",
    category: "financial",
    status: "failed",
    uploadDate: "Dec 11, 2024",
    size: "3.2 MB",
    icon: Banknote,
  },
  {
    id: "6",
    name: "Educational Certificate",
    type: "PDF",
    category: "education",
    status: "verified",
    uploadDate: "Dec 1, 2024",
    extractedData: {
      "Degree": "B.Tech Computer Science",
      "University": "Delhi University",
      "Year": "2012",
      "Grade": "First Class",
    },
    size: "980 KB",
    icon: GraduationCap,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "verified":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "pending":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "failed":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "verified":
      return CheckCircle
    case "pending":
      return Clock
    case "failed":
      return AlertCircle
    default:
      return Clock
  }
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            setUploadProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
  })

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || doc.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    total: documents.length,
    verified: documents.filter((d) => d.status === "verified").length,
    pending: documents.filter((d) => d.status === "pending").length,
    failed: documents.filter((d) => d.status === "failed").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your documents securely
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Shield className="w-3 h-3 text-green-500" />
            256-bit Encrypted
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Lock className="w-3 h-3" />
            Private
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: stats.total, icon: FileText, color: "text-primary" },
          { label: "Verified", value: stats.verified, icon: CheckCircle, color: "text-green-500" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-500" },
          { label: "Failed", value: stats.failed, icon: AlertCircle, color: "text-red-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-8 h-8 text-primary" />
                  </motion.div>
                </div>
                <div>
                  <p className="font-medium text-foreground">AI is analyzing your document...</p>
                  <p className="text-sm text-muted-foreground">Extracting information</p>
                </div>
                <div className="max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <p className="font-medium text-foreground mb-1">
                  {isDragActive ? "Drop your files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse (PDF, PNG, JPG up to 10MB)
                </p>
                <Button>Select Files</Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {documentCategories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.id)}
              className="whitespace-nowrap"
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-10 w-full sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredDocuments.map((doc, index) => {
              const StatusIcon = getStatusIcon(doc.status)
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-md transition-all hover:border-primary/30"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <doc.icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {doc.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground truncate">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">{doc.uploadDate}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground">{doc.size}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredDocuments.map((doc) => {
                    const StatusIcon = getStatusIcon(doc.status)
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <doc.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{doc.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {doc.uploadDate} • {doc.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(doc.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {doc.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedDoc && (
                <>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <selectedDoc.icon className="w-5 h-5 text-primary" />
                  </div>
                  {selectedDoc.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Document details and extracted information
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  {(() => {
                    const StatusIcon = getStatusIcon(selectedDoc.status)
                    return (
                      <>
                        <StatusIcon className={`w-5 h-5 ${selectedDoc.status === 'verified' ? 'text-green-500' : selectedDoc.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`} />
                        <div>
                          <p className="font-medium text-foreground capitalize">{selectedDoc.status}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedDoc.status === "verified"
                              ? "Document verified by AI"
                              : selectedDoc.status === "pending"
                              ? "Verification in progress"
                              : "Please re-upload a clearer copy"}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <Badge className={getStatusColor(selectedDoc.status)}>
                  {selectedDoc.status}
                </Badge>
              </div>

              {/* Extracted Data */}
              {selectedDoc.extractedData && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Extracted Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedDoc.extractedData).map(([key, value]) => (
                      <div key={key} className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">{key}</p>
                        <p className="font-medium text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
