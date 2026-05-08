"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Menu, 
  X, 
  Sparkles,
  ChevronDown
} from "lucide-react"

const navItems = [
  { 
    label: "Features", 
    href: "#features",
  },
  { 
    label: "How It Works", 
    href: "#how-it-works",
  },
  { 
    label: "Schemes", 
    href: "#schemes",
  },
  { 
    label: "Startup", 
    href: "#startup",
  },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-4 mt-4">
        <nav className="glass rounded-2xl px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold text-foreground">
                GovEase<span className="text-primary">AI</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium flex items-center gap-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="block py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="pt-4 flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  )
}
