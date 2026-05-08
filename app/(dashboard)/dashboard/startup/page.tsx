"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Building2, 
  FileText, 
  Users, 
  Landmark, 
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  AlertCircle,
  Clock,
  IndianRupee,
  Shield,
  FileCheck,
  Briefcase,
  Building,
  Store,
  Factory,
  Globe
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const businessTypes = [
  {
    id: "proprietorship",
    name: "Sole Proprietorship",
    icon: Store,
    description: "Single owner business, easiest to start",
    timeline: "1-3 days",
    cost: "500 - 2,000",
    recommended: false
  },
  {
    id: "partnership",
    name: "Partnership Firm",
    icon: Users,
    description: "Two or more partners sharing profits",
    timeline: "3-7 days",
    cost: "2,000 - 5,000",
    recommended: false
  },
  {
    id: "llp",
    name: "LLP",
    icon: Building,
    description: "Limited Liability Partnership - best for professionals",
    timeline: "10-15 days",
    cost: "5,000 - 10,000",
    recommended: true
  },
  {
    id: "pvt-ltd",
    name: "Private Limited",
    icon: Building2,
    description: "Most popular for startups seeking funding",
    timeline: "15-20 days",
    cost: "10,000 - 20,000",
    recommended: true
  },
  {
    id: "opc",
    name: "One Person Company",
    icon: Briefcase,
    description: "Single member company with limited liability",
    timeline: "10-15 days",
    cost: "8,000 - 15,000",
    recommended: false
  },
  {
    id: "public",
    name: "Public Limited",
    icon: Globe,
    description: "For large businesses planning IPO",
    timeline: "20-30 days",
    cost: "50,000+",
    recommended: false
  }
]

const industries = [
  "Technology & Software",
  "E-commerce & Retail",
  "Healthcare & Pharma",
  "Education & EdTech",
  "Finance & FinTech",
  "Manufacturing",
  "Food & Beverages",
  "Agriculture & AgriTech",
  "Real Estate",
  "Transportation & Logistics",
  "Media & Entertainment",
  "Professional Services",
  "Other"
]

const requiredLicenses = {
  "Technology & Software": ["GST Registration", "Shop & Establishment", "MSME Registration"],
  "E-commerce & Retail": ["GST Registration", "Shop & Establishment", "FSSAI (if food)", "Import-Export Code"],
  "Healthcare & Pharma": ["GST Registration", "Drug License", "CDSCO Approval", "Clinical Trial Permission"],
  "Education & EdTech": ["GST Registration", "Shop & Establishment", "UGC/AICTE Approval (if applicable)"],
  "Finance & FinTech": ["GST Registration", "RBI License", "NBFC Registration", "Payment Aggregator License"],
  "Manufacturing": ["GST Registration", "Factory License", "Pollution Control Board NOC", "MSME Registration"],
  "Food & Beverages": ["GST Registration", "FSSAI License", "Shop & Establishment", "Health Trade License"],
  "Agriculture & AgriTech": ["GST Registration", "APEDA Registration", "Plant Quarantine Certificate"],
  "Real Estate": ["GST Registration", "RERA Registration", "Building Plan Approval"],
  "Transportation & Logistics": ["GST Registration", "Transport License", "Motor Vehicle Permit"],
  "Media & Entertainment": ["GST Registration", "Censor Board Certificate", "Broadcasting License"],
  "Professional Services": ["GST Registration", "Professional Tax", "Shop & Establishment"],
  "Other": ["GST Registration", "Shop & Establishment", "MSME Registration"]
}

const steps = [
  { id: 1, name: "Business Type", icon: Building2 },
  { id: 2, name: "Basic Details", icon: FileText },
  { id: 3, name: "Directors/Partners", icon: Users },
  { id: 4, name: "Required Licenses", icon: Landmark },
  { id: 5, name: "Review & Submit", icon: CheckCircle2 }
]

export default function StartupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessType: "",
    companyName: "",
    companyName2: "",
    companyName3: "",
    industry: "",
    businessDescription: "",
    registeredAddress: "",
    city: "",
    state: "",
    pincode: "",
    directors: [
      { name: "", email: "", phone: "", din: "", shareholding: "" }
    ],
    authorizedCapital: "100000",
    paidUpCapital: "100000",
    selectedLicenses: [] as string[],
    agreedToTerms: false
  })

  const progress = (currentStep / steps.length) * 100

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDirectorChange = (index: number, field: string, value: string) => {
    const newDirectors = [...formData.directors]
    newDirectors[index] = { ...newDirectors[index], [field]: value }
    setFormData(prev => ({ ...prev, directors: newDirectors }))
  }

  const addDirector = () => {
    setFormData(prev => ({
      ...prev,
      directors: [...prev.directors, { name: "", email: "", phone: "", din: "", shareholding: "" }]
    }))
  }

  const removeDirector = (index: number) => {
    if (formData.directors.length > 1) {
      setFormData(prev => ({
        ...prev,
        directors: prev.directors.filter((_, i) => i !== index)
      }))
    }
  }

  const toggleLicense = (license: string) => {
    setFormData(prev => ({
      ...prev,
      selectedLicenses: prev.selectedLicenses.includes(license)
        ? prev.selectedLicenses.filter(l => l !== license)
        : [...prev.selectedLicenses, license]
    }))
  }

  const selectedBusinessType = businessTypes.find(b => b.id === formData.businessType)
  const availableLicenses = formData.industry 
    ? requiredLicenses[formData.industry as keyof typeof requiredLicenses] || requiredLicenses["Other"]
    : []

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessType !== ""
      case 2:
        return formData.companyName !== "" && formData.industry !== "" && formData.registeredAddress !== ""
      case 3:
        return formData.directors.every(d => d.name !== "" && d.email !== "")
      case 4:
        return formData.selectedLicenses.length > 0
      case 5:
        return formData.agreedToTerms
      default:
        return true
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight text-balance">Start Your Business</h1>
        </div>
        <p className="text-muted-foreground text-pretty">
          AI-powered business registration wizard to legally incorporate your company
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep > step.id 
                        ? "bg-secondary text-secondary-foreground" 
                        : currentStep === step.id 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`text-xs mt-2 hidden sm:block ${
                    currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-secondary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-1.5" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Step 1: Business Type */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Your Business Structure</CardTitle>
                <CardDescription>
                  Select the type of business entity that best suits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {businessTypes.map((type) => (
                    <Label
                      key={type.id}
                      htmlFor={type.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all hover:border-primary/50 ${
                        formData.businessType === type.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border"
                      }`}
                    >
                      <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <type.icon className="h-5 w-5 text-primary" />
                          </div>
                          {type.recommended && (
                            <Badge className="bg-secondary text-secondary-foreground">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{type.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {type.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {type.timeline}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3 w-3" />
                            {type.cost}
                          </span>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                {selectedBusinessType && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">AI Recommendation</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on your selection of <strong>{selectedBusinessType.name}</strong>, 
                          here&apos;s what you&apos;ll need: DSC for all directors, DIN for directors, 
                          Name Approval from MCA, and {selectedBusinessType.id === "pvt-ltd" || selectedBusinessType.id === "llp" 
                            ? "incorporation certificate" 
                            : "registration document"}.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Basic Details */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>
                  Provide basic information about your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      Proposed Company Name (Option 1) *
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground inline ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Name should be unique and not similar to existing companies. Must end with &apos;Private Limited&apos; for Pvt Ltd companies.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input 
                      id="companyName"
                      placeholder="e.g., TechVentures India Private Limited"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName2">Alternative Name (Option 2)</Label>
                      <Input 
                        id="companyName2"
                        placeholder="Second choice name"
                        value={formData.companyName2}
                        onChange={(e) => handleInputChange("companyName2", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName3">Alternative Name (Option 3)</Label>
                      <Input 
                        id="companyName3"
                        placeholder="Third choice name"
                        value={formData.companyName3}
                        onChange={(e) => handleInputChange("companyName3", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry/Sector *</Label>
                    <Select 
                      value={formData.industry}
                      onValueChange={(value) => handleInputChange("industry", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <textarea
                      id="businessDescription"
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Briefly describe your business activities..."
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-medium">Registered Office Address</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registeredAddress">Address *</Label>
                    <Input 
                      id="registeredAddress"
                      placeholder="Full address with building/office number"
                      value={formData.registeredAddress}
                      onChange={(e) => handleInputChange("registeredAddress", e.target.value)}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select 
                        value={formData.state}
                        onValueChange={(value) => handleInputChange("state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Telangana", "Gujarat", "Uttar Pradesh", "West Bengal", "Rajasthan", "Kerala"].map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input 
                        id="pincode"
                        placeholder="6-digit pincode"
                        value={formData.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                {(selectedBusinessType?.id === "pvt-ltd" || selectedBusinessType?.id === "public") && (
                  <div className="pt-4 border-t space-y-4">
                    <h4 className="font-medium">Share Capital</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="authorizedCapital">
                          Authorized Capital (INR)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground inline ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">Maximum capital the company can raise. Minimum is 1 Lakh for Pvt Ltd.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input 
                          id="authorizedCapital"
                          type="number"
                          value={formData.authorizedCapital}
                          onChange={(e) => handleInputChange("authorizedCapital", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paidUpCapital">Paid-Up Capital (INR)</Label>
                        <Input 
                          id="paidUpCapital"
                          type="number"
                          value={formData.paidUpCapital}
                          onChange={(e) => handleInputChange("paidUpCapital", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Directors/Partners */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedBusinessType?.id === "partnership" || selectedBusinessType?.id === "llp" 
                    ? "Partner Details" 
                    : "Director Details"}
                </CardTitle>
                <CardDescription>
                  Add information about {selectedBusinessType?.id === "partnership" || selectedBusinessType?.id === "llp" 
                    ? "partners" 
                    : "directors"} of your company
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.directors.map((director, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">
                        {selectedBusinessType?.id === "partnership" || selectedBusinessType?.id === "llp" 
                          ? `Partner ${index + 1}` 
                          : `Director ${index + 1}`}
                      </h4>
                      {formData.directors.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeDirector(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input 
                          placeholder="As per PAN card"
                          value={director.name}
                          onChange={(e) => handleDirectorChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input 
                          type="email"
                          placeholder="email@example.com"
                          value={director.email}
                          onChange={(e) => handleDirectorChange(index, "email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input 
                          placeholder="+91 XXXXX XXXXX"
                          value={director.phone}
                          onChange={(e) => handleDirectorChange(index, "phone", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>
                          DIN (if available)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-3.5 w-3.5 text-muted-foreground inline ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Director Identification Number - we can help apply for one if you don&apos;t have it</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input 
                          placeholder="8-digit DIN"
                          value={director.din}
                          onChange={(e) => handleDirectorChange(index, "din", e.target.value)}
                        />
                      </div>
                      {(selectedBusinessType?.id === "pvt-ltd" || selectedBusinessType?.id === "public") && (
                        <div className="space-y-2 sm:col-span-2">
                          <Label>Shareholding (%)</Label>
                          <Input 
                            type="number"
                            placeholder="e.g., 50"
                            value={director.shareholding}
                            onChange={(e) => handleDirectorChange(index, "shareholding", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                <Button 
                  variant="outline" 
                  onClick={addDirector}
                  className="w-full"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Add Another {selectedBusinessType?.id === "partnership" || selectedBusinessType?.id === "llp" 
                    ? "Partner" 
                    : "Director"}
                </Button>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Required Documents</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Each {selectedBusinessType?.id === "partnership" || selectedBusinessType?.id === "llp" 
                          ? "partner" 
                          : "director"} will need to provide: PAN Card, Aadhaar Card, 
                        Passport Size Photo, and Address Proof (Utility Bill/Bank Statement).
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Required Licenses */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Required Registrations & Licenses</CardTitle>
                <CardDescription>
                  Based on your business type and industry, these registrations are recommended
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.industry && (
                  <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="flex items-start gap-3">
                      <Sparkles className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">AI-Suggested Licenses for {formData.industry}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          We&apos;ve pre-selected the most common licenses needed for your industry. 
                          You can customize this selection based on your specific needs.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {availableLicenses.map((license) => (
                    <Label
                      key={license}
                      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                        formData.selectedLicenses.includes(license) 
                          ? "border-primary bg-primary/5" 
                          : "border-border"
                      }`}
                    >
                      <Checkbox 
                        checked={formData.selectedLicenses.includes(license)}
                        onCheckedChange={() => toggleLicense(license)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{license}</span>
                          <Badge variant="outline" className="text-xs">
                            {license === "GST Registration" ? "Mandatory" : "Recommended"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {license === "GST Registration" && "Required for businesses with turnover above 40 lakhs (20 lakhs for services)"}
                          {license === "FSSAI License" && "Food Safety and Standards Authority of India license for food businesses"}
                          {license === "Shop & Establishment" && "State-specific registration for commercial establishments"}
                          {license === "MSME Registration" && "Get benefits under MSME schemes including priority lending and subsidies"}
                          {license === "Import-Export Code" && "Required for international trade activities"}
                          {license === "Drug License" && "License to manufacture, sell, or distribute pharmaceutical products"}
                          {license === "RBI License" && "Reserve Bank of India approval for financial services"}
                          {license === "Factory License" && "Required for manufacturing units employing workers"}
                          {license === "RERA Registration" && "Real Estate Regulatory Authority registration for property projects"}
                          {!["GST Registration", "FSSAI License", "Shop & Establishment", "MSME Registration", "Import-Export Code", "Drug License", "RBI License", "Factory License", "RERA Registration"].includes(license) && "Required for compliance in your industry"}
                        </p>
                      </div>
                    </Label>
                  ))}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Card className="border-primary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">{formData.selectedLicenses.length}</p>
                          <p className="text-xs text-muted-foreground">Licenses Selected</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-secondary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">~30 days</p>
                          <p className="text-xs text-muted-foreground">Est. Timeline</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-info/20">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-info" />
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">100%</p>
                          <p className="text-xs text-muted-foreground">Compliance</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Application</CardTitle>
                <CardDescription>
                  Please review all the information before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Business Type Summary */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Business Structure
                  </h4>
                  <p className="text-sm">{selectedBusinessType?.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {selectedBusinessType?.timeline}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {selectedBusinessType?.cost}
                    </span>
                  </div>
                </div>

                {/* Company Details Summary */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Company Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Name:</span>
                      <span className="font-medium">{formData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span>{formData.industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{formData.city}, {formData.state}</span>
                    </div>
                  </div>
                </div>

                {/* Directors Summary */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    {selectedBusinessType?.id === "partnership" || selectedBusinessType?.id === "llp" 
                      ? "Partners" 
                      : "Directors"} ({formData.directors.length})
                  </h4>
                  <div className="space-y-2 text-sm">
                    {formData.directors.map((director, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-muted-foreground">{director.name}</span>
                        <span>{director.email}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Licenses Summary */}
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" />
                    Selected Licenses ({formData.selectedLicenses.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.selectedLicenses.map((license) => (
                      <Badge key={license} variant="secondary" className="text-xs">
                        {license}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cost Estimate */}
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Estimated Cost Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company Registration:</span>
                      <span>INR {selectedBusinessType?.cost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Licenses & Registrations:</span>
                      <span>INR {formData.selectedLicenses.length * 2000} - {formData.selectedLicenses.length * 5000}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Government Fees:</span>
                      <span>INR 3,000 - 8,000</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-medium">
                      <span>Total Estimated:</span>
                      <span className="text-primary">INR 15,000 - 35,000</span>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <Label className="flex items-start gap-3 p-4 rounded-lg border cursor-pointer">
                  <Checkbox 
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
                    className="mt-0.5"
                  />
                  <span className="text-sm">
                    I confirm that all the information provided is accurate and I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>. 
                    I authorize GovEase AI to submit applications on my behalf.
                  </span>
                </Label>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length ? (
          <Button 
            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
            disabled={!canProceed()}
          >
            Next Step
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            disabled={!canProceed()}
            className="bg-secondary hover:bg-secondary/90"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Submit Application
          </Button>
        )}
      </div>
    </div>
  )
}
