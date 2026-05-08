"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  Search,
  Phone,
  Mail,
  Clock,
  Navigation,
  Star,
  Building2,
  Users,
  ExternalLink,
  Filter,
} from "lucide-react"

const offices = [
  {
    id: 1,
    name: "District Collector Office",
    type: "District Administration",
    address: "Civil Lines, Collectorate Complex, New Delhi - 110001",
    phone: "+91 11 2345 6789",
    email: "collector.delhi@gov.in",
    hours: "Mon-Fri: 9:30 AM - 5:30 PM",
    distance: "2.5 km",
    rating: 4.2,
    services: ["Land Records", "Certificates", "Grievances"],
    isOpen: true,
  },
  {
    id: 2,
    name: "Passport Seva Kendra",
    type: "Central Government",
    address: "Bhikaji Cama Place, New Delhi - 110066",
    phone: "+91 11 2467 8900",
    email: "psk.delhi@mea.gov.in",
    hours: "Mon-Sat: 9:00 AM - 6:00 PM",
    distance: "5.8 km",
    rating: 4.5,
    services: ["Passport", "Police Clearance", "Renewal"],
    isOpen: true,
  },
  {
    id: 3,
    name: "Regional Transport Office",
    type: "State Transport",
    address: "Loni Road, Shahdara, Delhi - 110032",
    phone: "+91 11 2232 5678",
    email: "rto.shahdara@delhi.gov.in",
    hours: "Mon-Sat: 10:00 AM - 5:00 PM",
    distance: "8.2 km",
    rating: 3.8,
    services: ["Driving License", "Vehicle Registration", "Permits"],
    isOpen: false,
  },
  {
    id: 4,
    name: "Income Tax Office",
    type: "Central Government",
    address: "C.R. Building, I.P. Estate, New Delhi - 110002",
    phone: "+91 11 2337 1234",
    email: "it.delhi@incometax.gov.in",
    hours: "Mon-Fri: 10:00 AM - 5:00 PM",
    distance: "3.1 km",
    rating: 3.5,
    services: ["Tax Filing", "PAN Card", "TDS"],
    isOpen: true,
  },
  {
    id: 5,
    name: "EPFO Regional Office",
    type: "Central Government",
    address: "Bhavishya Nidhi Bhawan, 14 Bhikaji Cama Place, New Delhi",
    phone: "+91 11 2617 5678",
    email: "ro.delhi@epfindia.gov.in",
    hours: "Mon-Fri: 9:30 AM - 6:00 PM",
    distance: "6.0 km",
    rating: 4.0,
    services: ["EPF Withdrawal", "Pension", "Claims"],
    isOpen: true,
  },
  {
    id: 6,
    name: "Municipal Corporation Office",
    type: "Local Body",
    address: "Town Hall, Chandni Chowk, Delhi - 110006",
    phone: "+91 11 2386 4567",
    email: "mcd.north@delhi.gov.in",
    hours: "Mon-Sat: 9:00 AM - 5:00 PM",
    distance: "4.5 km",
    rating: 3.2,
    services: ["Property Tax", "Birth Certificate", "Trade License"],
    isOpen: true,
  },
]

const officeTypes = [
  "All Types",
  "District Administration",
  "Central Government",
  "State Transport",
  "Local Body",
]

export default function OfficesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [sortBy, setSortBy] = useState("distance")

  const filteredOffices = offices
    .filter((office) => {
      const matchesSearch = office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = typeFilter === "All Types" || office.type === typeFilter
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance)
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Government Offices</h1>
        <p className="text-muted-foreground mt-1">Find nearby government offices and their services</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search offices or services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Office Type" />
                </SelectTrigger>
                <SelectContent>
                  {officeTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Nearest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Interactive map showing nearby offices</p>
            <Button variant="outline" className="mt-4">
              <Navigation className="w-4 h-4 mr-2" />
              Enable Location
            </Button>
          </div>
        </div>
      </Card>

      {/* Offices List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {filteredOffices.length} Offices Found
          </h2>
        </div>

        <div className="grid gap-4">
          {filteredOffices.map((office, index) => (
            <motion.div
              key={office.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-foreground">{office.name}</h3>
                              <Badge variant={office.isOpen ? "default" : "secondary"} className={office.isOpen ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" : ""}>
                                {office.isOpen ? "Open Now" : "Closed"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{office.type}</p>
                          </div>
                          <div className="flex items-center gap-1 text-sm shrink-0">
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium text-foreground">{office.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{office.address}</span>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {office.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {office.hours}
                            </span>
                            <span className="flex items-center gap-1">
                              <Navigation className="w-4 h-4" />
                              {office.distance}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {office.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 lg:flex-col lg:items-end">
                      <Button variant="outline" size="sm">
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                      <Button size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
