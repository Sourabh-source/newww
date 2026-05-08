// Multi-Agent System Types for GovEase AI Platform

export type AgentType = 
  | "research" 
  | "eligibility" 
  | "ocr" 
  | "submission" 
  | "notification" 
  | "reflection"

export type AgentStatus = "idle" | "running" | "completed" | "failed" | "paused"

export type WorkflowStatus = "pending" | "running" | "completed" | "failed" | "paused"

export interface AgentConfig {
  id: AgentType
  name: string
  description: string
  capabilities: string[]
  maxRetries: number
  timeoutMs: number
  dependencies?: AgentType[]
}

export interface AgentInput {
  userId: string
  workflowId: string
  stepIndex: number
  data: Record<string, unknown>
  context: WorkflowContext
}

export interface AgentOutput {
  success: boolean
  data: Record<string, unknown>
  reasoning: ReasoningTrace[]
  confidence: number
  executionTimeMs: number
  nextAgent?: AgentType
  error?: string
}

export interface ReasoningTrace {
  step: number
  action: string
  thought: string
  observation: string
  confidence: number
  timestamp: string
}

export interface WorkflowContext {
  userId: string
  applicationId?: string
  schemeId?: string
  documents: DocumentData[]
  userProfile: UserProfile
  previousSteps: AgentOutput[]
  metadata: Record<string, unknown>
}

export interface DocumentData {
  id: string
  name: string
  type: string
  extractedData: Record<string, unknown>
  verificationStatus: "pending" | "verified" | "rejected"
  ocrConfidence?: number
}

export interface UserProfile {
  id: string
  fullName?: string
  email?: string
  phone?: string
  aadhaarVerified: boolean
  documents: string[]
  demographics?: {
    age?: number
    gender?: string
    state?: string
    district?: string
    category?: string
    income?: number
    occupation?: string
    landHolding?: number
  }
}

export interface WorkflowStep {
  index: number
  agentType: AgentType
  status: AgentStatus
  input?: AgentInput
  output?: AgentOutput
  startedAt?: string
  completedAt?: string
  error?: string
}

export interface Workflow {
  id: string
  userId: string
  name: string
  description: string
  type: "scheme_application" | "document_verification" | "eligibility_check" | "general"
  status: WorkflowStatus
  steps: WorkflowStep[]
  currentStepIndex: number
  context: WorkflowContext
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface SchemeData {
  id: string
  name: string
  ministry: string
  description: string
  eligibilityCriteria: EligibilityCriterion[]
  benefits: string[]
  requiredDocuments: string[]
  applicationDeadline?: string
  category: string
}

export interface EligibilityCriterion {
  field: string
  operator: "equals" | "greaterThan" | "lessThan" | "includes" | "between" | "exists"
  value: unknown
  description: string
}

export interface EligibilityResult {
  schemeId: string
  schemeName: string
  isEligible: boolean
  matchedCriteria: string[]
  unmatchedCriteria: string[]
  eligibilityScore: number
  recommendations: string[]
}

// Agent event types for real-time tracking
export type AgentEventType = 
  | "workflow_started"
  | "step_started"
  | "step_progress"
  | "step_completed"
  | "step_failed"
  | "workflow_completed"
  | "workflow_failed"

export interface AgentEvent {
  type: AgentEventType
  workflowId: string
  stepIndex?: number
  agentType?: AgentType
  data?: Record<string, unknown>
  reasoning?: ReasoningTrace
  timestamp: string
}

// Workflow templates
export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  type: Workflow["type"]
  steps: Array<{
    agentType: AgentType
    name: string
    description: string
  }>
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "scheme_application",
    name: "Scheme Application Workflow",
    description: "Complete workflow for applying to a government scheme",
    type: "scheme_application",
    steps: [
      { agentType: "research", name: "Research Schemes", description: "Find matching schemes based on user profile" },
      { agentType: "ocr", name: "Process Documents", description: "Extract data from uploaded documents" },
      { agentType: "eligibility", name: "Check Eligibility", description: "Verify eligibility against scheme criteria" },
      { agentType: "reflection", name: "Review & Optimize", description: "Review decisions and suggest improvements" },
      { agentType: "submission", name: "Submit Application", description: "Prepare and submit the application" },
      { agentType: "notification", name: "Send Notifications", description: "Notify user of application status" },
    ],
  },
  {
    id: "document_verification",
    name: "Document Verification Workflow",
    description: "Verify and extract data from user documents",
    type: "document_verification",
    steps: [
      { agentType: "ocr", name: "OCR Processing", description: "Extract text and data from documents" },
      { agentType: "reflection", name: "Verify Extraction", description: "Review and validate extracted data" },
      { agentType: "notification", name: "Notify Results", description: "Send verification results to user" },
    ],
  },
  {
    id: "eligibility_check",
    name: "Eligibility Check Workflow",
    description: "Check eligibility across multiple schemes",
    type: "eligibility_check",
    steps: [
      { agentType: "research", name: "Gather Scheme Data", description: "Collect relevant scheme information" },
      { agentType: "eligibility", name: "Evaluate Eligibility", description: "Check against all criteria" },
      { agentType: "reflection", name: "Analyze Results", description: "Review and rank eligible schemes" },
      { agentType: "notification", name: "Report Results", description: "Send eligibility report to user" },
    ],
  },
]

// Agent configurations
export const AGENT_CONFIGS: Record<AgentType, AgentConfig> = {
  research: {
    id: "research",
    name: "Research Agent",
    description: "Searches and analyzes government schemes, policies, and regulations",
    capabilities: [
      "Search government scheme database",
      "Analyze policy documents",
      "Compare schemes by benefits",
      "Track deadline changes",
      "Find related schemes",
    ],
    maxRetries: 3,
    timeoutMs: 30000,
  },
  eligibility: {
    id: "eligibility",
    name: "Eligibility Agent",
    description: "Evaluates user eligibility against scheme criteria with detailed reasoning",
    capabilities: [
      "Parse eligibility criteria",
      "Match user profile to criteria",
      "Calculate eligibility scores",
      "Identify missing requirements",
      "Suggest profile improvements",
    ],
    maxRetries: 2,
    timeoutMs: 20000,
    dependencies: ["research"],
  },
  ocr: {
    id: "ocr",
    name: "OCR Document Agent",
    description: "Extracts and validates data from identity documents and certificates",
    capabilities: [
      "Extract text from images/PDFs",
      "Identify document types",
      "Parse structured data (Aadhaar, PAN, etc.)",
      "Validate document authenticity",
      "Cross-reference extracted data",
    ],
    maxRetries: 3,
    timeoutMs: 45000,
  },
  submission: {
    id: "submission",
    name: "Submission Agent",
    description: "Prepares, validates, and submits applications to government portals",
    capabilities: [
      "Auto-fill application forms",
      "Validate form data",
      "Attach required documents",
      "Submit to portals via API",
      "Track submission status",
    ],
    maxRetries: 3,
    timeoutMs: 60000,
    dependencies: ["eligibility", "ocr"],
  },
  notification: {
    id: "notification",
    name: "Notification Agent",
    description: "Sends timely updates and alerts about applications and schemes",
    capabilities: [
      "Send status updates",
      "Deadline reminders",
      "New scheme alerts",
      "Document request notifications",
      "Multi-channel delivery (email, SMS, push)",
    ],
    maxRetries: 5,
    timeoutMs: 10000,
  },
  reflection: {
    id: "reflection",
    name: "Reflection Agent",
    description: "Reviews AI decisions, identifies errors, and suggests improvements",
    capabilities: [
      "Review agent outputs",
      "Identify logical errors",
      "Suggest corrections",
      "Improve confidence scores",
      "Learn from feedback",
    ],
    maxRetries: 2,
    timeoutMs: 25000,
  },
}
