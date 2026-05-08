"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { 
  Search, 
  FileCheck, 
  Bot, 
  Shield, 
  Building2, 
  FileText,
  Zap,
  Globe
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Smart Scheme Discovery",
    description: "AI analyzes your profile to find government schemes you qualify for. No more missing out on benefits.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: FileCheck,
    title: "Auto Document Verification",
    description: "Upload documents once. Our OCR technology extracts, validates, and stores information securely.",
    gradient: "from-secondary to-secondary/60",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description: "Get instant answers about procedures, requirements, and deadlines in simple language you understand.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-grade encryption protects your data. Your documents are never shared without consent.",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Building2,
    title: "Business Setup Wizard",
    description: "Start your business legally with step-by-step guidance on registrations, licenses, and compliance.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: FileText,
    title: "Auto Form Filling",
    description: "Never fill the same information twice. AI pre-fills applications using your verified documents.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Zap,
    title: "Real-time Tracking",
    description: "Track application status, deadlines, and get proactive alerts for required actions.",
    gradient: "from-primary to-accent",
  },
  {
    icon: Globe,
    title: "Multi-language Support",
    description: "Access services in your preferred language. Break language barriers with AI translation.",
    gradient: "from-secondary to-primary",
  },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Everything You Need to Navigate{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Government Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Powerful AI tools designed to simplify bureaucracy and save you time on paperwork.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
