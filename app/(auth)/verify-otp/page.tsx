"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  Mail,
  RefreshCw
} from "lucide-react"

export default function VerifyOTPPage() {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()

    // Resend timer
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, "").slice(0, 6).split("")
      const newOtp = [...otp]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit
        }
      })
      setOtp(newOtp)
      const nextIndex = Math.min(index + digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
    } else {
      const newOtp = [...otp]
      newOtp[index] = value.replace(/\D/g, "")
      setOtp(newOtp)
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")
    if (code.length !== 6) return

    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    router.push("/dashboard")
  }

  const handleResend = async () => {
    setCanResend(false)
    setResendTimer(30)
    // Simulate resend
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-8"
        >
          <Link href="/signup">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="glass rounded-3xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Verify your email</h1>
            <p className="text-muted-foreground">
              {"We've sent a 6-digit code to"}{" "}
              <span className="text-foreground font-medium">user@example.com</span>
            </p>
          </div>

          {/* OTP Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-semibold"
                />
              ))}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            {canResend ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                className="text-primary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend code
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in{" "}
                <span className="font-medium text-foreground">{resendTimer}s</span>
              </p>
            )}
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {"Didn't receive the code? Check your spam folder or"}{" "}
          <Link href="/contact" className="text-primary hover:underline">
            contact support
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
