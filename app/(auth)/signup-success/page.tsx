"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Mail, ArrowRight, CheckCircle } from "lucide-react"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="absolute inset-0 grid-pattern" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md text-center"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            GovEase<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </motion.div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Check your email
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          {"We've sent a confirmation link to your email address. Please click the link to verify your account and get started."}
        </p>

        {/* Email Icon */}
        <div className="p-6 rounded-2xl bg-card border border-border mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or"}
          </p>
          <Button variant="link" className="text-primary p-0 h-auto mt-1">
            resend the confirmation email
          </Button>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href="/login">
              Continue to Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
