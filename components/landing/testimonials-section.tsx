"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Small Business Owner",
    location: "Delhi",
    content: "GovEase AI helped me discover 4 schemes I was eligible for but never knew about. The auto-fill feature saved me hours of paperwork!",
    rating: 5,
    initials: "PS",
  },
  {
    name: "Rajesh Kumar",
    role: "Farmer",
    location: "Punjab",
    content: "Finally, someone made government services easy to understand. The AI assistant explained everything in simple Hindi. Got my PM Kisan benefits within 2 weeks.",
    rating: 5,
    initials: "RK",
  },
  {
    name: "Anita Desai",
    role: "Startup Founder",
    location: "Bangalore",
    content: "Started my food business with complete legal compliance thanks to the business wizard. It told me exactly which licenses I needed and how to get them.",
    rating: 5,
    initials: "AD",
  },
  {
    name: "Mohammed Ali",
    role: "Street Vendor",
    location: "Mumbai",
    content: "Got my PM SVANidhi loan approved in just 10 days. The app helped me upload all documents correctly the first time. No rejections!",
    rating: 5,
    initials: "MA",
  },
  {
    name: "Lakshmi Iyer",
    role: "Senior Citizen",
    location: "Chennai",
    content: "My grandson showed me this app. Now I can track my pension status and got enrolled in Ayushman Bharat without visiting any office.",
    rating: 5,
    initials: "LI",
  },
  {
    name: "Vikram Singh",
    role: "IT Professional",
    location: "Hyderabad",
    content: "Used the platform to register my consulting company. The cost estimator was spot-on and the step-by-step guidance was invaluable.",
    rating: 5,
    initials: "VS",
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              50,000+ Citizens
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Real stories from real people who transformed their experience with government services.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-secondary">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
