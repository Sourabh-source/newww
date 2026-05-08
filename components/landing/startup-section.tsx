"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Building2, 
  Shield, 
  FileText, 
  Calculator,
  CheckCircle,
  ArrowRight,
  Briefcase,
  Scale
} from "lucide-react"

const benefits = [
  {
    icon: Shield,
    title: "Legal Compliance Check",
    description: "Verify your business idea against regulations before investing",
  },
  {
    icon: FileText,
    title: "Registration Guidance",
    description: "Step-by-step process for company registration and GST",
  },
  {
    icon: Calculator,
    title: "Cost Estimation",
    description: "Get accurate estimates for setup costs, licenses, and taxes",
  },
  {
    icon: Briefcase,
    title: "License Requirements",
    description: "Know exactly which permits and licenses you need",
  },
]

const businessTypes = [
  { name: "Restaurant / Food Business", licenses: 8, time: "30-45 days" },
  { name: "E-commerce Store", licenses: 4, time: "15-20 days" },
  { name: "IT Services Company", licenses: 3, time: "10-15 days" },
  { name: "Manufacturing Unit", licenses: 12, time: "60-90 days" },
  { name: "Healthcare Clinic", licenses: 10, time: "45-60 days" },
  { name: "Education Institute", licenses: 9, time: "90-120 days" },
]

export function StartupSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="startup" ref={ref} className="py-24 relative bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Business Setup
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Start Your Business{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                The Right Way
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Our AI-powered wizard guides you through every step of legally starting your business - from idea validation to final registration.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button size="lg" asChild className="px-8">
              <Link href="/startup">
                <Building2 className="mr-2 w-5 h-5" />
                Start Business Wizard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Right Content - Business Types Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Scale className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Business Setup Guide</h3>
                  <p className="text-sm text-muted-foreground">Popular business categories</p>
                </div>
              </div>

              <div className="space-y-3">
                {businessTypes.map((business, index) => (
                  <motion.div
                    key={business.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-background/50 hover:bg-background transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                        {business.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{business.licenses} licenses</div>
                      <div className="text-xs font-medium text-primary">{business.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Shield className="w-4 h-4 text-green-500" />
                  Legality Verification Included
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  AI checks your business against 200+ regulatory requirements
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
