"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Brain,
  FileSearch,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Search,
  Database,
  Shield,
  Zap,
  Clock,
} from "lucide-react"

export interface ReasoningStep {
  id: string
  type: "search" | "analysis" | "verification" | "decision" | "recommendation"
  title: string
  description: string
  details?: string[]
  confidence?: number
  duration?: string
  status: "completed" | "in_progress" | "pending"
}

interface DecisionTimelineProps {
  steps: ReasoningStep[]
  isProcessing?: boolean
  showDetails?: boolean
}

const stepIcons = {
  search: Search,
  analysis: Brain,
  verification: Shield,
  decision: Lightbulb,
  recommendation: Zap,
}

const stepColors = {
  search: "bg-blue-500/10 text-blue-500",
  analysis: "bg-purple-500/10 text-purple-500",
  verification: "bg-green-500/10 text-green-500",
  decision: "bg-orange-500/10 text-orange-500",
  recommendation: "bg-pink-500/10 text-pink-500",
}

export function DecisionTimeline({ 
  steps, 
  isProcessing = false,
  showDetails: initialShowDetails = false 
}: DecisionTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(
    initialShowDetails ? new Set(steps.map(s => s.id)) : new Set()
  )

  const toggleStep = (id: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSteps(newExpanded)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Reasoning Trace</h3>
          {isProcessing && (
            <Badge variant="outline" className="text-primary border-primary/30">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-1.5 animate-pulse" />
              Processing
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (expandedSteps.size === steps.length) {
              setExpandedSteps(new Set())
            } else {
              setExpandedSteps(new Set(steps.map(s => s.id)))
            }
          }}
        >
          {expandedSteps.size === steps.length ? "Collapse All" : "Expand All"}
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-border" />

        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = stepIcons[step.type]
            const colorClass = stepColors[step.type]
            const isExpanded = expandedSteps.has(step.id)
            const isLast = index === steps.length - 1

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`flex gap-4 cursor-pointer group ${
                    step.status === "pending" ? "opacity-50" : ""
                  }`}
                  onClick={() => toggleStep(step.id)}
                >
                  {/* Icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                    {step.status === "in_progress" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                    ) : step.status === "completed" ? (
                      <Icon className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {step.title}
                        </h4>
                        {step.status === "completed" && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        {step.status === "in_progress" && (
                          <Badge variant="outline" className="text-xs">In Progress</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {step.duration && (
                          <span className="text-xs text-muted-foreground">{step.duration}</span>
                        )}
                        {step.confidence !== undefined && (
                          <Badge variant="secondary" className="text-xs">
                            {step.confidence}% confident
                          </Badge>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>

                    <AnimatePresence>
                      {isExpanded && step.details && step.details.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3"
                        >
                          <Card className="bg-muted/50">
                            <CardContent className="p-4">
                              <ul className="space-y-2 text-sm">
                                {step.details.map((detail, i) => (
                                  <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Example usage component for testing
export function DecisionTimelineDemo() {
  const exampleSteps: ReasoningStep[] = [
    {
      id: "1",
      type: "search",
      title: "Searching Government Scheme Database",
      description: "Querying 500+ central and state government schemes based on your profile",
      details: [
        "Searching agriculture schemes for farmers in Maharashtra",
        "Filtering by annual income < ₹3,00,000",
        "Including land ownership criteria",
        "Checking age eligibility (18-60 years)",
      ],
      duration: "1.2s",
      status: "completed",
    },
    {
      id: "2",
      type: "analysis",
      title: "Analyzing Document Data",
      description: "Extracting relevant information from your uploaded documents",
      details: [
        "Extracted name: Rahul Sharma",
        "Verified Aadhaar number format",
        "Detected land holding: 2.5 hectares",
        "Income verified from ITR: ₹2,45,000",
      ],
      confidence: 98,
      duration: "2.3s",
      status: "completed",
    },
    {
      id: "3",
      type: "verification",
      title: "Cross-verifying Eligibility Criteria",
      description: "Matching your profile against scheme requirements",
      details: [
        "PM-KISAN: All criteria met ✓",
        "PMFBY: Land size criteria met ✓",
        "PMEGP: Income criteria met ✓",
        "Startup India: Business registration pending",
      ],
      confidence: 96,
      duration: "1.8s",
      status: "completed",
    },
    {
      id: "4",
      type: "recommendation",
      title: "Generating Personalized Recommendations",
      description: "Ranking schemes by potential benefit and approval probability",
      status: "in_progress",
    },
  ]

  return <DecisionTimeline steps={exampleSteps} isProcessing />
}
