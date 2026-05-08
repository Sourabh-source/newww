"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Sparkles,
  Mic,
  Paperclip,
  Bot,
  User,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw,
  Lightbulb,
  FileText,
  Building2,
  Search,
  Languages,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
}

const suggestedPrompts = [
  {
    icon: Search,
    text: "Am I eligible for any government schemes?",
    category: "Schemes",
  },
  {
    icon: FileText,
    text: "What documents do I need to open a food shop?",
    category: "Documents",
  },
  {
    icon: Building2,
    text: "How do I register my startup?",
    category: "Business",
  },
  {
    icon: Lightbulb,
    text: "What licenses do I need for e-commerce?",
    category: "Licenses",
  },
]

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI assistant for government services. I can help you discover schemes you're eligible for, guide you through business registration, explain document requirements, and much more. How can I assist you today?",
    timestamp: new Date(),
    confidence: 95,
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(input),
      timestamp: new Date(),
      confidence: Math.floor(Math.random() * 15) + 85,
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, aiResponse])
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">GovEase AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Languages className="w-4 h-4 mr-2" />
            English
          </Button>
          <Button variant="ghost" size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea ref={scrollRef} className="flex-1 py-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className={message.role === "assistant" ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground" : "bg-muted"}>
                  {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={`flex flex-col gap-2 max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {message.confidence && (
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {message.confidence}% confidence
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsUp className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-4"
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="w-2 h-2 rounded-full bg-muted-foreground/50"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-4"
        >
          <p className="text-sm text-muted-foreground mb-3">Suggested prompts:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-3xl mx-auto">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt.text)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <prompt.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{prompt.text}</p>
                  <p className="text-xs text-muted-foreground">{prompt.category}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input Area */}
      <div className="border-t border-border pt-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 p-2 rounded-xl border border-border bg-background focus-within:border-primary/50 transition-colors">
            <Button variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything about government services..."
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
            <Button variant="ghost" size="icon" className="shrink-0">
              <Mic className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isTyping}
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            GovEase AI may make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}

function getAIResponse(input: string): string {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes("eligible") || lowerInput.includes("scheme")) {
    return `Based on your profile, I found **12 schemes** you may be eligible for. Here are the top 3 matches:

1. **PM Kisan Samman Nidhi** (92% match)
   - Benefit: ₹6,000/year direct income support
   - Status: Applications open

2. **Ayushman Bharat PMJAY** (88% match)
   - Benefit: ₹5 Lakh health coverage
   - Status: Enrollment available

3. **PM SVANidhi** (75% match)
   - Benefit: ₹10,000 micro-loan
   - Status: Applications open

Would you like me to help you apply for any of these schemes? I can also show you the complete list of eligible schemes.`
  }
  
  if (lowerInput.includes("document") || lowerInput.includes("food shop") || lowerInput.includes("restaurant")) {
    return `To open a food business in India, you'll need the following documents and licenses:

**Essential Documents:**
- Aadhaar Card & PAN Card
- Address Proof (utility bill/rent agreement)
- Passport-size photographs
- Business registration certificate

**Required Licenses:**
1. **FSSAI License** - Food safety registration (mandatory)
2. **Trade License** - From local municipal corporation
3. **GST Registration** - If turnover exceeds ₹20 lakhs
4. **Fire Safety Certificate** - For dine-in establishments
5. **Health/Eating House License** - Local health department

**Estimated Timeline:** 30-45 days
**Estimated Cost:** ₹15,000 - ₹25,000

Would you like me to guide you through the application process for any of these licenses?`
  }
  
  if (lowerInput.includes("startup") || lowerInput.includes("register") || lowerInput.includes("business")) {
    return `Great question! Here's a step-by-step guide to register your startup in India:

**Step 1: Choose Business Structure**
- Private Limited Company (recommended for startups)
- LLP (Limited Liability Partnership)
- Sole Proprietorship

**Step 2: Register Your Business**
- Obtain DSC (Digital Signature Certificate)
- Apply for DIN (Director Identification Number)
- Reserve company name on MCA portal
- File incorporation documents

**Step 3: Post-Registration**
- Get PAN & TAN for the company
- Open business bank account
- Register for GST (if applicable)
- Apply for Startup India recognition

**Estimated Timeline:** 10-15 days
**Government Fees:** ₹3,000 - ₹10,000

Would you like me to start the Business Setup Wizard to guide you through this process?`
  }
  
  if (lowerInput.includes("license")) {
    return `I can help you understand license requirements! The licenses you need depend on your business type and location.

**Common Business Licenses:**
- Trade License (all businesses)
- GST Registration (if turnover > ₹20 lakhs)
- Shop & Establishment License
- Professional Tax Registration

**Industry-Specific Licenses:**
- FSSAI (Food businesses)
- Drug License (Pharmacy/Medical)
- MSME Registration (Manufacturing)
- Import-Export Code (International trade)

Please tell me more about your business type and location, and I'll provide a detailed list of required licenses with application procedures.`
  }
  
  return `Thank you for your question! I understand you're asking about "${input}".

To provide you with the most accurate and helpful information, I'd need a few more details:

1. What specific government service are you looking for help with?
2. Which state/city are you located in?
3. What is your current situation or requirement?

In the meantime, here are some things I can help you with:
- Finding government schemes you're eligible for
- Document requirements for various applications
- Business registration and licensing guidance
- Tracking application status
- Understanding government procedures

Feel free to ask about any of these topics!`
}
