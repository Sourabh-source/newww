"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Heart,
  Bookmark,
  Share2,
  GraduationCap,
  Home,
  Briefcase,
  Wheat,
  Banknote,
  Building2,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Star,
} from "lucide-react"

interface Scheme {
  id: string
  name: string
  description: string
  category: string
  matchScore: number
  benefit: string
  eligibility: string[]
  requiredDocs: string[]
  deadline: string
  status: "open" | "closing-soon" | "closed"
  ministry: string
  beneficiaries: string
  isSaved: boolean
}

const schemes: Scheme[] = [
  {
    id: "1",
    name: "PM Kisan Samman Nidhi",
    description: "Direct income support scheme providing ₹6,000 per year in three equal installments to small and marginal farmer families.",
    category: "agriculture",
    matchScore: 92,
    benefit: "₹6,000/year",
    eligibility: ["Small and marginal farmers", "Land holding up to 2 hectares", "Indian citizen"],
    requiredDocs: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    deadline: "Ongoing",
    status: "open",
    ministry: "Ministry of Agriculture",
    beneficiaries: "11 Cr+",
    isSaved: false,
  },
  {
    id: "2",
    name: "Ayushman Bharat PMJAY",
    description: "Free health coverage up to ₹5 lakh per family per year for secondary and tertiary hospitalization.",
    category: "healthcare",
    matchScore: 88,
    benefit: "₹5 Lakh coverage",
    eligibility: ["Economically weaker sections", "No age limit", "Valid Aadhaar"],
    requiredDocs: ["Aadhaar Card", "Ration Card", "Income Certificate"],
    deadline: "Ongoing",
    status: "open",
    ministry: "Ministry of Health",
    beneficiaries: "55 Cr+",
    isSaved: true,
  },
  {
    id: "3",
    name: "PM SVANidhi",
    description: "Micro-credit facility providing affordable loans up to ₹10,000 to street vendors for working capital.",
    category: "employment",
    matchScore: 75,
    benefit: "₹10,000 loan",
    eligibility: ["Street vendors", "Valid vendor certificate", "Age 18+"],
    requiredDocs: ["Vendor Certificate", "Aadhaar Card", "Bank Account"],
    deadline: "Dec 2025",
    status: "open",
    ministry: "Ministry of Housing",
    beneficiaries: "50 Lakh+",
    isSaved: false,
  },
  {
    id: "4",
    name: "Startup India Seed Fund",
    description: "Financial assistance to startups for proof of concept, prototype development, and market entry.",
    category: "business",
    matchScore: 82,
    benefit: "Up to ₹50 Lakh",
    eligibility: ["DPIIT recognized startup", "Less than 2 years old", "Indian incorporated"],
    requiredDocs: ["DPIIT Certificate", "PAN Card", "Bank Statement", "Pitch Deck"],
    deadline: "Mar 2025",
    status: "closing-soon",
    ministry: "DPIIT",
    beneficiaries: "5000+",
    isSaved: false,
  },
  {
    id: "5",
    name: "PM Awas Yojana",
    description: "Affordable housing scheme providing financial assistance for construction/purchase of houses.",
    category: "housing",
    matchScore: 70,
    benefit: "₹2.67 Lakh subsidy",
    eligibility: ["EWS/LIG/MIG categories", "First-time home buyer", "No existing pucca house"],
    requiredDocs: ["Income Certificate", "Aadhaar Card", "Land Documents"],
    deadline: "Dec 2024",
    status: "closing-soon",
    ministry: "Ministry of Housing",
    beneficiaries: "2.95 Cr",
    isSaved: false,
  },
  {
    id: "6",
    name: "National Scholarship Portal",
    description: "Scholarship schemes for students from economically weaker sections pursuing higher education.",
    category: "education",
    matchScore: 65,
    benefit: "Up to ₹50,000/year",
    eligibility: ["Students", "Family income below ₹8 Lakh", "Enrolled in recognized institution"],
    requiredDocs: ["Mark sheets", "Income Certificate", "College Fee Receipt"],
    deadline: "Jan 2025",
    status: "open",
    ministry: "Ministry of Education",
    beneficiaries: "1.5 Cr+",
    isSaved: true,
  },
]

const categories = [
  { id: "all", label: "All Schemes", icon: Sparkles },
  { id: "agriculture", label: "Agriculture", icon: Wheat },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "housing", label: "Housing", icon: Home },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "business", label: "Business", icon: Building2 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "closing-soon":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "closed":
      return "bg-red-500/10 text-red-500 border-red-500/20"
    default:
      return "bg-muted text-muted-foreground"
  }
}

const getMatchColor = (score: number) => {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

export default function SchemesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("match")
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null)
  const [savedOnly, setSavedOnly] = useState(false)
  const [schemesData, setSchemesData] = useState(schemes)

  const filteredSchemes = schemesData
    .filter((scheme) => {
      const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scheme.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === "all" || scheme.category === activeCategory
      const matchesSaved = !savedOnly || scheme.isSaved
      return matchesSearch && matchesCategory && matchesSaved
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore
      if (sortBy === "deadline") return a.deadline.localeCompare(b.deadline)
      return a.name.localeCompare(b.name)
    })

  const toggleSave = (id: string) => {
    setSchemesData((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isSaved: !s.isSaved } : s))
    )
  }

  const highMatchCount = schemesData.filter((s) => s.matchScore >= 80).length
  const savedCount = schemesData.filter((s) => s.isSaved).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Government Schemes</h1>
          <p className="text-muted-foreground mt-1">
            AI-matched schemes based on your profile
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-500 border-green-500/20">
            <Sparkles className="w-3 h-3" />
            {highMatchCount} High Matches
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Bookmark className="w-3 h-3" />
            {savedCount} Saved
          </Badge>
        </div>
      </div>

      {/* Profile Summary */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Your AI-Generated Profile Summary</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Based on your documents: 28-year-old male, residing in Delhi, annual income ₹4.5L, employed in IT sector
              </p>
            </div>
            <Button variant="outline" size="sm">
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
          {categories.map((cat) => (
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

        {/* Search & Sort */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search schemes..."
              className="pl-10 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={savedOnly ? "default" : "outline"}
            size="icon"
            onClick={() => setSavedOnly(!savedOnly)}
          >
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredSchemes.map((scheme, index) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-all hover:border-primary/30">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getStatusColor(scheme.status)}>
                          {scheme.status === "open" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {scheme.status === "closing-soon" && <Clock className="w-3 h-3 mr-1" />}
                          {scheme.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {scheme.ministry}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg">{scheme.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {scheme.description}
                      </p>
                    </div>
                    <div className="text-center shrink-0">
                      <div className={`text-2xl font-bold ${getMatchColor(scheme.matchScore)}`}>
                        {scheme.matchScore}%
                      </div>
                      <p className="text-xs text-muted-foreground">Match</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Banknote className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-foreground">{scheme.benefit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{scheme.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{scheme.beneficiaries}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button className="flex-1" onClick={() => setSelectedScheme(scheme)}>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleSave(scheme.id)}
                      className={scheme.isSaved ? "text-primary" : ""}
                    >
                      <Bookmark className={`w-4 h-4 ${scheme.isSaved ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredSchemes.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No schemes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find more schemes
          </p>
        </Card>
      )}

      {/* Scheme Details Dialog */}
      <Dialog open={!!selectedScheme} onOpenChange={() => setSelectedScheme(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={selectedScheme ? getStatusColor(selectedScheme.status) : ""}>
                {selectedScheme?.status}
              </Badge>
              <Badge variant="outline">
                <Sparkles className="w-3 h-3 mr-1" />
                {selectedScheme?.matchScore}% Match
              </Badge>
            </div>
            <DialogTitle className="text-xl">{selectedScheme?.name}</DialogTitle>
            <DialogDescription>{selectedScheme?.description}</DialogDescription>
          </DialogHeader>
          {selectedScheme && (
            <div className="space-y-6 mt-4">
              {/* Key Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-green-500/10">
                  <Banknote className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{selectedScheme.benefit}</p>
                  <p className="text-xs text-muted-foreground">Benefit Amount</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-blue-500/10">
                  <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{selectedScheme.deadline}</p>
                  <p className="text-xs text-muted-foreground">Deadline</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-500/10">
                  <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="font-semibold text-foreground">{selectedScheme.beneficiaries}</p>
                  <p className="text-xs text-muted-foreground">Beneficiaries</p>
                </div>
              </div>

              {/* Eligibility */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Eligibility Criteria
                </h4>
                <div className="space-y-2">
                  {selectedScheme.eligibility.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Required Documents
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedScheme.requiredDocs.map((doc, i) => (
                    <Badge key={i} variant="outline">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1">
                  Apply Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={() => toggleSave(selectedScheme.id)}>
                  <Bookmark className={`w-4 h-4 mr-2 ${selectedScheme.isSaved ? "fill-current" : ""}`} />
                  {selectedScheme.isSaved ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
