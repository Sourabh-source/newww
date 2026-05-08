"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Heart, 
  Home, 
  Briefcase, 
  Wheat, 
  Banknote,
  ArrowRight,
  Sparkles,
  CheckCircle
} from "lucide-react"

const schemeCategories = [
  {
    icon: GraduationCap,
    title: "Education",
    schemes: ["Scholarships", "Student Loans", "Skill Development"],
    count: 45,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Heart,
    title: "Healthcare",
    schemes: ["Health Insurance", "Medical Aid", "Disability Support"],
    count: 32,
    color: "bg-red-500/10 text-red-500",
  },
  {
    icon: Home,
    title: "Housing",
    schemes: ["Home Loans", "Rural Housing", "Urban Development"],
    count: 28,
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Briefcase,
    title: "Employment",
    schemes: ["Job Training", "Self Employment", "MSME Support"],
    count: 56,
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Wheat,
    title: "Agriculture",
    schemes: ["Crop Insurance", "Farm Equipment", "Irrigation"],
    count: 41,
    color: "bg-yellow-500/10 text-yellow-500",
  },
  {
    icon: Banknote,
    title: "Financial Aid",
    schemes: ["Pension Schemes", "Subsidies", "Direct Benefits"],
    count: 38,
    color: "bg-cyan-500/10 text-cyan-500",
  },
]

const featuredSchemes = [
  {
    title: "PM Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000/year to farmer families",
    eligibility: "All land-holding farmer families",
    benefit: "₹6,000/year",
    deadline: "Ongoing",
    aiMatch: 92,
  },
  {
    title: "Ayushman Bharat PMJAY",
    description: "Free health coverage up to ₹5 lakh per family per year",
    eligibility: "Economically vulnerable families",
    benefit: "₹5 Lakh coverage",
    deadline: "Ongoing",
    aiMatch: 88,
  },
  {
    title: "PM SVANidhi",
    description: "Micro-credit facility for street vendors",
    eligibility: "Street vendors with valid certificate",
    benefit: "₹10,000 loan",
    deadline: "Dec 2025",
    aiMatch: 75,
  },
]

export function SchemesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="schemes" ref={ref} className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Government Schemes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Discover Benefits{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              You Deserve
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our AI scans 500+ central and state schemes to find exactly what you qualify for.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
        >
          {schemeCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="glass rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{category.title}</h3>
              <p className="text-xs text-muted-foreground">{category.count} schemes</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Schemes */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-semibold text-foreground">Featured Schemes</h3>
            <Button variant="ghost" asChild className="text-primary">
              <Link href="/dashboard/schemes">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSchemes.map((scheme, index) => (
              <motion.div
                key={scheme.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {scheme.aiMatch}% Match
                  </Badge>
                  <span className="text-xs text-muted-foreground">{scheme.deadline}</span>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {scheme.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {scheme.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">{scheme.eligibility}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{scheme.benefit}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Check Eligibility
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
