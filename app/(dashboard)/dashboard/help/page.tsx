"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Search,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  BookOpen,
  Video,
  ExternalLink,
  ArrowRight,
  Headphones,
  Clock,
  CheckCircle,
} from "lucide-react"

const faqs = [
  {
    question: "How do I apply for a government scheme?",
    answer: "To apply for a government scheme, navigate to the Schemes section, search for your desired scheme, check your eligibility, and click 'Apply Now'. Our AI assistant will guide you through the application process and help auto-fill forms using your uploaded documents."
  },
  {
    question: "What documents do I need to upload?",
    answer: "Common documents include Aadhaar Card, PAN Card, Income Certificate, Caste Certificate, and Address Proof. The required documents vary by scheme. Our system will automatically detect and verify your documents using AI."
  },
  {
    question: "How long does application processing take?",
    answer: "Processing times vary by scheme and department. Most applications are reviewed within 7-30 days. You can track your application status in real-time from the Applications section."
  },
  {
    question: "Is my data secure on this platform?",
    answer: "Yes, we use bank-grade encryption to protect your data. All documents are stored securely with end-to-end encryption. We comply with Government of India data protection guidelines."
  },
  {
    question: "How does the AI assistant work?",
    answer: "Our AI assistant uses advanced natural language processing to understand your queries, recommend suitable schemes, auto-fill application forms, and provide step-by-step guidance throughout the application process."
  },
  {
    question: "Can I withdraw or modify my application?",
    answer: "You can modify draft applications at any time. Once submitted, modifications depend on the specific scheme rules. Contact the relevant department for withdrawal requests."
  },
  {
    question: "What if my application is rejected?",
    answer: "If your application is rejected, you'll receive detailed reasons via notification. You can address the issues and reapply, or use our grievance redressal system to appeal the decision."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us through the AI chat assistant, email at support@govease.ai, or call our helpline at 1800-XXX-XXXX (toll-free). Our support team is available Monday to Saturday, 9 AM to 6 PM."
  },
]

const helpCategories = [
  {
    icon: FileText,
    title: "Getting Started",
    description: "Learn the basics of using GovEase AI",
    articles: 12,
  },
  {
    icon: BookOpen,
    title: "Schemes & Benefits",
    description: "Understanding government schemes",
    articles: 24,
  },
  {
    icon: HelpCircle,
    title: "Application Process",
    description: "Step-by-step application guides",
    articles: 18,
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch and learn with videos",
    articles: 8,
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-2">How can we help you?</h1>
        <p className="text-muted-foreground">
          Search our knowledge base or browse categories below
        </p>
      </div>

      {/* Search */}
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-12 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Chat with AI</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant answers from our AI assistant
              </p>
              <Button className="w-full">
                Start Chat
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                <Headphones className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Call Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Speak with our support team
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                1800-XXX-XXXX
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send us a detailed message
              </p>
              <Button variant="outline" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                support@govease.ai
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Help Categories */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                      <p className="text-xs text-primary">{category.articles} articles</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Quick answers to common questions</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Support Hours */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Support Hours</h3>
                <p className="text-sm text-muted-foreground">Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Average Response Time</h3>
                <p className="text-sm text-muted-foreground">Under 2 hours during business hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
