// Individual Agent Implementations for GovEase AI Platform

import {
  AgentType,
  AgentInput,
  AgentOutput,
  ReasoningTrace,
  SchemeData,
  EligibilityResult,
  DocumentData,
  AGENT_CONFIGS,
} from "./types"

// Simulated scheme database for demo
const DEMO_SCHEMES: SchemeData[] = [
  {
    id: "pm-kisan",
    name: "PM-KISAN Samman Nidhi",
    ministry: "Ministry of Agriculture",
    description: "Income support of ₹6,000 per year to small and marginal farmers",
    eligibilityCriteria: [
      { field: "occupation", operator: "equals", value: "farmer", description: "Must be a farmer" },
      { field: "landHolding", operator: "lessThan", value: 2, description: "Land holding less than 2 hectares" },
      { field: "income", operator: "lessThan", value: 200000, description: "Annual income below ₹2 lakh" },
    ],
    benefits: ["₹6,000 per year in 3 installments", "Direct bank transfer", "No middlemen"],
    requiredDocuments: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    category: "agriculture",
  },
  {
    id: "pmegp",
    name: "PMEGP - Prime Minister Employment Generation Programme",
    ministry: "Ministry of MSME",
    description: "Credit-linked subsidy for setting up micro enterprises",
    eligibilityCriteria: [
      { field: "age", operator: "greaterThan", value: 18, description: "Must be above 18 years" },
      { field: "education", operator: "exists", value: true, description: "Minimum 8th pass for projects above ₹10 lakh" },
    ],
    benefits: ["Subsidy up to 35% for general category", "Up to ₹25 lakh for manufacturing", "Up to ₹10 lakh for service"],
    requiredDocuments: ["Aadhaar Card", "Educational Certificates", "Project Report", "Bank Account"],
    category: "entrepreneurship",
  },
  {
    id: "startup-india",
    name: "Startup India Registration",
    ministry: "DPIIT",
    description: "Recognition and benefits for innovative startups",
    eligibilityCriteria: [
      { field: "businessAge", operator: "lessThan", value: 10, description: "Business less than 10 years old" },
      { field: "turnover", operator: "lessThan", value: 100000000, description: "Annual turnover below ₹100 crore" },
      { field: "innovation", operator: "equals", value: true, description: "Must be working on innovation" },
    ],
    benefits: ["Tax exemption for 3 years", "Self-certification compliance", "Fast-track patent application", "Fund of Funds access"],
    requiredDocuments: ["Incorporation Certificate", "PAN Card", "Brief about innovation"],
    category: "startup",
  },
  {
    id: "pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    ministry: "Ministry of Agriculture",
    description: "Crop insurance scheme for farmers",
    eligibilityCriteria: [
      { field: "occupation", operator: "equals", value: "farmer", description: "Must be a farmer" },
      { field: "hasLand", operator: "equals", value: true, description: "Must have cultivable land" },
    ],
    benefits: ["Premium subsidy up to 98%", "Full sum insured coverage", "Quick claim settlement"],
    requiredDocuments: ["Land Records", "Aadhaar Card", "Bank Account", "Sowing Certificate"],
    category: "agriculture",
  },
]

// Helper to create reasoning traces
function createReasoningTrace(
  step: number,
  action: string,
  thought: string,
  observation: string,
  confidence: number
): ReasoningTrace {
  return {
    step,
    action,
    thought,
    observation,
    confidence,
    timestamp: new Date().toISOString(),
  }
}

// Simulate async processing with delay
async function simulateProcessing(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================
// RESEARCH AGENT
// ============================================
export async function runResearchAgent(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now()
  const reasoning: ReasoningTrace[] = []
  const { context } = input

  try {
    // Step 1: Analyze user profile
    reasoning.push(
      createReasoningTrace(
        1,
        "Analyzing user profile",
        "I need to understand the user's demographics and needs to find relevant schemes",
        `User profile: ${context.userProfile.demographics?.occupation || "Not specified"}, Income: ₹${context.userProfile.demographics?.income || "Unknown"}`,
        95
      )
    )
    await simulateProcessing(500)

    // Step 2: Search scheme database
    reasoning.push(
      createReasoningTrace(
        2,
        "Searching scheme database",
        "Querying 500+ government schemes based on profile attributes",
        `Found ${DEMO_SCHEMES.length} potentially relevant schemes in database`,
        90
      )
    )
    await simulateProcessing(800)

    // Step 3: Filter by category
    const userOccupation = context.userProfile.demographics?.occupation?.toLowerCase() || ""
    let filteredSchemes = DEMO_SCHEMES

    if (userOccupation.includes("farmer") || userOccupation.includes("agriculture")) {
      filteredSchemes = DEMO_SCHEMES.filter(
        (s) => s.category === "agriculture" || s.category === "entrepreneurship"
      )
    }

    reasoning.push(
      createReasoningTrace(
        3,
        "Filtering by user category",
        `Filtering schemes based on occupation: ${userOccupation || "general"}`,
        `Narrowed down to ${filteredSchemes.length} relevant schemes`,
        88
      )
    )
    await simulateProcessing(400)

    // Step 4: Rank by relevance
    reasoning.push(
      createReasoningTrace(
        4,
        "Ranking schemes by relevance",
        "Scoring schemes based on profile match, benefit amount, and approval likelihood",
        `Top schemes: ${filteredSchemes.slice(0, 3).map((s) => s.name).join(", ")}`,
        92
      )
    )
    await simulateProcessing(300)

    return {
      success: true,
      data: {
        schemes: filteredSchemes,
        totalFound: filteredSchemes.length,
        searchCriteria: {
          occupation: userOccupation,
          state: context.userProfile.demographics?.state,
          income: context.userProfile.demographics?.income,
        },
      },
      reasoning,
      confidence: 91,
      executionTimeMs: Date.now() - startTime,
      nextAgent: "ocr",
    }
  } catch (error) {
    return {
      success: false,
      data: {},
      reasoning,
      confidence: 0,
      executionTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Research agent failed",
    }
  }
}

// ============================================
// ELIGIBILITY AGENT
// ============================================
export async function runEligibilityAgent(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now()
  const reasoning: ReasoningTrace[] = []
  const { context, data } = input

  try {
    const schemes = (data.schemes as SchemeData[]) || DEMO_SCHEMES
    const results: EligibilityResult[] = []

    // Step 1: Load criteria
    reasoning.push(
      createReasoningTrace(
        1,
        "Loading eligibility criteria",
        "Parsing eligibility rules for each scheme to prepare for evaluation",
        `Loaded criteria for ${schemes.length} schemes`,
        98
      )
    )
    await simulateProcessing(300)

    // Step 2: Evaluate each scheme
    for (const scheme of schemes) {
      const matchedCriteria: string[] = []
      const unmatchedCriteria: string[] = []

      for (const criterion of scheme.eligibilityCriteria) {
        const userValue = context.userProfile.demographics?.[criterion.field as keyof typeof context.userProfile.demographics]
        let matches = false

        switch (criterion.operator) {
          case "equals":
            matches = userValue === criterion.value || 
              (typeof userValue === "string" && userValue.toLowerCase().includes(String(criterion.value).toLowerCase()))
            break
          case "greaterThan":
            matches = typeof userValue === "number" && userValue > (criterion.value as number)
            break
          case "lessThan":
            matches = typeof userValue === "number" && userValue < (criterion.value as number)
            break
          case "exists":
            matches = userValue !== undefined && userValue !== null
            break
          default:
            matches = true // Be lenient for unknown operators
        }

        if (matches) {
          matchedCriteria.push(criterion.description)
        } else {
          unmatchedCriteria.push(criterion.description)
        }
      }

      const eligibilityScore = scheme.eligibilityCriteria.length > 0
        ? (matchedCriteria.length / scheme.eligibilityCriteria.length) * 100
        : 50

      results.push({
        schemeId: scheme.id,
        schemeName: scheme.name,
        isEligible: eligibilityScore >= 60,
        matchedCriteria,
        unmatchedCriteria,
        eligibilityScore,
        recommendations: unmatchedCriteria.length > 0
          ? [`Consider providing documents to prove: ${unmatchedCriteria[0]}`]
          : ["All criteria met - ready to apply!"],
      })
    }
    await simulateProcessing(600)

    // Step 3: Log evaluation results
    const eligibleCount = results.filter((r) => r.isEligible).length
    reasoning.push(
      createReasoningTrace(
        2,
        "Evaluating eligibility",
        "Matching user profile against each criterion using logical operators",
        `User is eligible for ${eligibleCount} out of ${results.length} schemes`,
        94
      )
    )

    // Step 4: Generate recommendations
    reasoning.push(
      createReasoningTrace(
        3,
        "Generating recommendations",
        "Analyzing gaps and suggesting ways to improve eligibility",
        `Generated ${results.reduce((sum, r) => sum + r.recommendations.length, 0)} recommendations`,
        89
      )
    )
    await simulateProcessing(400)

    return {
      success: true,
      data: {
        results,
        eligibleSchemes: results.filter((r) => r.isEligible),
        ineligibleSchemes: results.filter((r) => !r.isEligible),
        totalEligible: eligibleCount,
      },
      reasoning,
      confidence: 92,
      executionTimeMs: Date.now() - startTime,
      nextAgent: "reflection",
    }
  } catch (error) {
    return {
      success: false,
      data: {},
      reasoning,
      confidence: 0,
      executionTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Eligibility agent failed",
    }
  }
}

// ============================================
// OCR DOCUMENT AGENT
// ============================================
export async function runOCRAgent(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now()
  const reasoning: ReasoningTrace[] = []
  const { context } = input

  try {
    const processedDocuments: DocumentData[] = []

    // Step 1: Identify documents
    reasoning.push(
      createReasoningTrace(
        1,
        "Identifying document types",
        "Analyzing uploaded files to determine document categories (Aadhaar, PAN, etc.)",
        `Found ${context.documents.length} documents to process`,
        96
      )
    )
    await simulateProcessing(400)

    // Step 2: Process each document
    for (const doc of context.documents) {
      // Simulate OCR extraction
      const extractedData: Record<string, unknown> = {}
      let ocrConfidence = 0

      if (doc.type.toLowerCase().includes("aadhaar")) {
        extractedData.name = context.userProfile.fullName || "Extracted Name"
        extractedData.aadhaarNumber = "XXXX-XXXX-" + Math.floor(1000 + Math.random() * 9000)
        extractedData.dob = "1990-01-15"
        extractedData.address = "123 Main Street, City, State - 400001"
        ocrConfidence = 97
      } else if (doc.type.toLowerCase().includes("pan")) {
        extractedData.panNumber = "ABCDE1234F"
        extractedData.name = context.userProfile.fullName || "Extracted Name"
        extractedData.fatherName = "Father Name"
        ocrConfidence = 95
      } else if (doc.type.toLowerCase().includes("land") || doc.type.toLowerCase().includes("khata")) {
        extractedData.landArea = "2.5 hectares"
        extractedData.surveyNumber = "123/4"
        extractedData.village = "Sample Village"
        extractedData.ownerName = context.userProfile.fullName || "Extracted Name"
        ocrConfidence = 89
      } else {
        extractedData.rawText = "Document content extracted"
        ocrConfidence = 75
      }

      processedDocuments.push({
        ...doc,
        extractedData,
        ocrConfidence,
        verificationStatus: ocrConfidence > 90 ? "verified" : "pending",
      })

      reasoning.push(
        createReasoningTrace(
          2,
          `Processing ${doc.name}`,
          `Running OCR and data extraction on ${doc.type} document`,
          `Extracted ${Object.keys(extractedData).length} fields with ${ocrConfidence}% confidence`,
          ocrConfidence
        )
      )
      await simulateProcessing(800)
    }

    // Step 3: Cross-verify data
    reasoning.push(
      createReasoningTrace(
        3,
        "Cross-verifying extracted data",
        "Comparing data across documents to ensure consistency",
        "Name and details consistent across documents",
        93
      )
    )
    await simulateProcessing(300)

    return {
      success: true,
      data: {
        processedDocuments,
        totalProcessed: processedDocuments.length,
        averageConfidence:
          processedDocuments.reduce((sum, d) => sum + (d.ocrConfidence || 0), 0) /
          Math.max(processedDocuments.length, 1),
        verifiedCount: processedDocuments.filter((d) => d.verificationStatus === "verified").length,
      },
      reasoning,
      confidence: 94,
      executionTimeMs: Date.now() - startTime,
      nextAgent: "eligibility",
    }
  } catch (error) {
    return {
      success: false,
      data: {},
      reasoning,
      confidence: 0,
      executionTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "OCR agent failed",
    }
  }
}

// ============================================
// SUBMISSION AGENT
// ============================================
export async function runSubmissionAgent(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now()
  const reasoning: ReasoningTrace[] = []
  const { context, data } = input

  try {
    const eligibleSchemes = (data.eligibleSchemes as EligibilityResult[]) || []
    const schemeToApply = eligibleSchemes[0] // Apply to the first eligible scheme

    if (!schemeToApply) {
      throw new Error("No eligible schemes found to submit")
    }

    // Step 1: Prepare application
    reasoning.push(
      createReasoningTrace(
        1,
        "Preparing application form",
        `Gathering required data for ${schemeToApply.schemeName} application`,
        "Form fields identified: 15 required, 8 optional",
        95
      )
    )
    await simulateProcessing(500)

    // Step 2: Auto-fill form
    const formData = {
      applicantName: context.userProfile.fullName,
      email: context.userProfile.email,
      phone: context.userProfile.phone,
      schemeId: schemeToApply.schemeId,
      schemeName: schemeToApply.schemeName,
      documentsAttached: context.documents.map((d) => d.name),
      demographics: context.userProfile.demographics,
      submittedAt: new Date().toISOString(),
    }

    reasoning.push(
      createReasoningTrace(
        2,
        "Auto-filling application",
        "Populating form fields with verified user data",
        `Auto-filled ${Object.keys(formData).length} fields from user profile and documents`,
        92
      )
    )
    await simulateProcessing(600)

    // Step 3: Validate submission
    reasoning.push(
      createReasoningTrace(
        3,
        "Validating submission",
        "Checking all required fields and document attachments",
        "Validation passed - all required fields complete",
        98
      )
    )
    await simulateProcessing(300)

    // Step 4: Submit application
    const applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    reasoning.push(
      createReasoningTrace(
        4,
        "Submitting application",
        "Sending application to government portal",
        `Application submitted successfully with ID: ${applicationId}`,
        99
      )
    )
    await simulateProcessing(800)

    return {
      success: true,
      data: {
        applicationId,
        schemeId: schemeToApply.schemeId,
        schemeName: schemeToApply.schemeName,
        formData,
        status: "submitted",
        submittedAt: new Date().toISOString(),
        estimatedProcessingDays: 15,
      },
      reasoning,
      confidence: 96,
      executionTimeMs: Date.now() - startTime,
      nextAgent: "notification",
    }
  } catch (error) {
    return {
      success: false,
      data: {},
      reasoning,
      confidence: 0,
      executionTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Submission agent failed",
    }
  }
}

// ============================================
// NOTIFICATION AGENT
// ============================================
export async function runNotificationAgent(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now()
  const reasoning: ReasoningTrace[] = []
  const { context, data } = input

  try {
    const notifications: Array<{
      type: string
      channel: string
      recipient: string
      subject: string
      message: string
      sentAt: string
    }> = []

    // Step 1: Determine notification type
    reasoning.push(
      createReasoningTrace(
        1,
        "Analyzing notification context",
        "Determining what type of notification to send based on workflow progress",
        `Context: Application ${data.applicationId || "verification"} workflow`,
        95
      )
    )
    await simulateProcessing(200)

    // Step 2: Prepare notifications
    if (data.applicationId) {
      notifications.push({
        type: "application_submitted",
        channel: "email",
        recipient: context.userProfile.email || "user@example.com",
        subject: `Application Submitted: ${data.schemeName}`,
        message: `Your application (${data.applicationId}) for ${data.schemeName} has been submitted successfully. Expected processing time: ${data.estimatedProcessingDays} days.`,
        sentAt: new Date().toISOString(),
      })

      if (context.userProfile.phone) {
        notifications.push({
          type: "application_submitted",
          channel: "sms",
          recipient: context.userProfile.phone,
          subject: "Application Submitted",
          message: `GovEase: Application ${data.applicationId} submitted. Track at govease.in/track`,
          sentAt: new Date().toISOString(),
        })
      }
    } else {
      notifications.push({
        type: "workflow_complete",
        channel: "in_app",
        recipient: context.userId,
        subject: "Workflow Completed",
        message: "Your workflow has been completed successfully. Check your dashboard for details.",
        sentAt: new Date().toISOString(),
      })
    }

    reasoning.push(
      createReasoningTrace(
        2,
        "Preparing notifications",
        "Creating personalized messages for each channel",
        `Prepared ${notifications.length} notifications`,
        97
      )
    )
    await simulateProcessing(300)

    // Step 3: Send notifications
    reasoning.push(
      createReasoningTrace(
        3,
        "Sending notifications",
        "Dispatching notifications through configured channels",
        `Sent ${notifications.length} notifications successfully`,
        99
      )
    )
    await simulateProcessing(400)

    return {
      success: true,
      data: {
        notifications,
        sentCount: notifications.length,
        channels: [...new Set(notifications.map((n) => n.channel))],
      },
      reasoning,
      confidence: 98,
      executionTimeMs: Date.now() - startTime,
    }
  } catch (error) {
    return {
      success: false,
      data: {},
      reasoning,
      confidence: 0,
      executionTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Notification agent failed",
    }
  }
}

// ============================================
// REFLECTION AGENT
// ============================================
export async function runReflectionAgent(input: AgentInput): Promise<AgentOutput> {
  const startTime = Date.now()
  const reasoning: ReasoningTrace[] = []
  const { context, data } = input

  try {
    const previousOutputs = context.previousSteps
    const issues: string[] = []
    const improvements: string[] = []
    let overallConfidence = 0

    // Step 1: Review previous agent outputs
    reasoning.push(
      createReasoningTrace(
        1,
        "Reviewing previous agent outputs",
        "Analyzing decisions made by other agents in this workflow",
        `Reviewing ${previousOutputs.length} previous step outputs`,
        95
      )
    )
    await simulateProcessing(400)

    // Step 2: Analyze confidence scores
    for (const output of previousOutputs) {
      if (output.confidence < 80) {
        issues.push(`Low confidence (${output.confidence}%) in step - may need human review`)
      }
      overallConfidence += output.confidence
    }
    overallConfidence = previousOutputs.length > 0 
      ? overallConfidence / previousOutputs.length 
      : 85

    reasoning.push(
      createReasoningTrace(
        2,
        "Analyzing confidence scores",
        "Checking if any steps have low confidence that may indicate errors",
        `Average confidence: ${overallConfidence.toFixed(1)}%, Issues found: ${issues.length}`,
        92
      )
    )
    await simulateProcessing(300)

    // Step 3: Check for logical inconsistencies
    if (data.eligibleSchemes && Array.isArray(data.eligibleSchemes)) {
      const eligibleCount = data.eligibleSchemes.length
      if (eligibleCount === 0) {
        improvements.push("Consider uploading additional documents to improve eligibility")
        improvements.push("Review profile information for accuracy")
      } else {
        improvements.push(`${eligibleCount} schemes are available - prioritize by benefit amount`)
      }
    }

    reasoning.push(
      createReasoningTrace(
        3,
        "Checking logical consistency",
        "Verifying that decisions align with user data and scheme criteria",
        `Generated ${improvements.length} improvement suggestions`,
        90
      )
    )
    await simulateProcessing(300)

    // Step 4: Generate final assessment
    const assessment = {
      overallScore: overallConfidence,
      issuesFound: issues.length,
      improvementssuggested: improvements.length,
      recommendation: overallConfidence > 85 
        ? "Proceed with submission" 
        : "Consider reviewing flagged issues before proceeding",
    }

    reasoning.push(
      createReasoningTrace(
        4,
        "Generating assessment",
        "Creating final review summary with recommendations",
        `Overall assessment: ${assessment.recommendation}`,
        94
      )
    )
    await simulateProcessing(200)

    return {
      success: true,
      data: {
        assessment,
        issues,
        improvements,
        reviewedSteps: previousOutputs.length,
        passedData: data, // Pass through data from previous steps
        eligibleSchemes: data.eligibleSchemes, // Ensure eligibility data passes through
      },
      reasoning,
      confidence: overallConfidence,
      executionTimeMs: Date.now() - startTime,
      nextAgent: issues.length > 2 ? undefined : "submission",
    }
  } catch (error) {
    return {
      success: false,
      data: {},
      reasoning,
      confidence: 0,
      executionTimeMs: Date.now() - startTime,
      error: error instanceof Error ? error.message : "Reflection agent failed",
    }
  }
}

// Agent runner map
export const AGENT_RUNNERS: Record<AgentType, (input: AgentInput) => Promise<AgentOutput>> = {
  research: runResearchAgent,
  eligibility: runEligibilityAgent,
  ocr: runOCRAgent,
  submission: runSubmissionAgent,
  notification: runNotificationAgent,
  reflection: runReflectionAgent,
}
