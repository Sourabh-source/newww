"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "How does GovEase AI find schemes I'm eligible for?",
    answer: "Our AI analyzes your profile information (age, income, location, occupation, etc.) against 500+ government schemes database. It uses advanced matching algorithms to find schemes where you meet the eligibility criteria, even partial matches are highlighted for your review.",
  },
  {
    question: "Is my personal data and documents secure?",
    answer: "Absolutely. We use bank-grade 256-bit encryption for all data. Your documents are stored securely and never shared without your explicit consent. We're compliant with government data protection guidelines and undergo regular security audits.",
  },
  {
    question: "How accurate is the auto form-filling feature?",
    answer: "Our OCR and AI extraction technology has 99.2% accuracy rate. However, we always show you the pre-filled information for verification before submission. You can edit any field if needed.",
  },
  {
    question: "What documents do I need to upload?",
    answer: "Basic documents include Aadhaar Card, PAN Card, and address proof. Depending on schemes you apply for, you may need income certificates, caste certificates, bank statements, or educational documents. Our AI tells you exactly what's needed for each application.",
  },
  {
    question: "Can I use GovEase AI in my regional language?",
    answer: "Yes! We support 10 major Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia. Our AI assistant can converse in your preferred language.",
  },
  {
    question: "How much does the business setup wizard cost?",
    answer: "The basic eligibility check and guidance is free. We charge only for actual government registration fees (which you'd pay anyway) plus a small service fee for document preparation and filing assistance. All costs are shown upfront before you proceed.",
  },
  {
    question: "What if my application gets rejected?",
    answer: "Our AI pre-validates applications to minimize rejections. If rejected, we analyze the reason and guide you to fix issues. Many rejections happen due to document errors - our verification catches 95% of these before submission.",
  },
  {
    question: "Do I need to visit government offices?",
    answer: "For most schemes, no physical visit is required. About 85% of applications can be completed entirely online through our platform. For cases requiring physical verification, we help you book appointments and prepare all necessary documents.",
  },
]

export function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 relative bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Everything you need to know about GovEase AI and how it can help you.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
