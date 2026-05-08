"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Sparkles, 
  FileCheck, 
  Building2, 
  Bot,
  Shield,
  Zap
} from "lucide-react"

const floatingCards = [
  {
    icon: FileCheck,
    title: "AI Eligibility Detection",
    description: "Instant scheme matching",
    position: "top-20 -left-4 md:left-10",
    delay: 0.2,
  },
  {
    icon: Bot,
    title: "Auto Form Filling",
    description: "Smart document processing",
    position: "top-40 -right-4 md:right-10",
    delay: 0.4,
  },
  {
    icon: Shield,
    title: "Business Verification",
    description: "Legal compliance check",
    position: "bottom-32 -left-4 md:left-20",
    delay: 0.6,
  },
  {
    icon: Building2,
    title: "License Guidance",
    description: "Step-by-step process",
    position: "bottom-20 -right-4 md:right-20",
    delay: 0.8,
  },
]

export function HeroSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI-Powered Government Services</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-5xl mx-auto"
          >
            <span className="text-balance">
              Simplifying Government Services with{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty"
          >
            Discover schemes you qualify for, auto-apply with AI assistance, manage documents securely, and legally start your business with minimal effort.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" asChild className="text-base px-8 py-6 rounded-xl glow-primary">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 py-6 rounded-xl">
              <Link href="#schemes">
                Explore Schemes
              </Link>
            </Button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
          >
            <Link href="/chat" className="flex items-center gap-2 hover:text-foreground transition-colors group">
              <Bot className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              Talk to AI Assistant
            </Link>
            <span className="hidden sm:inline text-border">|</span>
            <Link href="/startup" className="flex items-center gap-2 hover:text-foreground transition-colors group">
              <Building2 className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
              Start Your Business
            </Link>
            <span className="hidden sm:inline text-border">|</span>
            <Link href="/schemes" className="flex items-center gap-2 hover:text-foreground transition-colors group">
              <Zap className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
              Check Eligibility
            </Link>
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: card.delay }}
              className={`absolute ${card.position}`}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 3 + index * 0.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="glass rounded-2xl p-4 shadow-lg pointer-events-auto hover:scale-105 transition-transform cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <card.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
