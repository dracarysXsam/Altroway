"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Star, MapPin, Phone, Mail, Calendar, Shield, Award, Users } from "lucide-react"

const legalPartners = [
  {
    id: 1,
    name: "Dr. Maria Schmidt",
    firm: "Schmidt Immigration Law",
    location: "Berlin, Germany",
    specialties: ["Work Visas", "EU Blue Card", "Family Reunification"],
    rating: 4.9,
    reviews: 127,
    languages: ["English", "German", "Spanish"],
    experience: "15+ years",
    price: "€150/hour",
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "James van der Berg",
    firm: "Amsterdam Legal Partners",
    location: "Amsterdam, Netherlands",
    specialties: ["Skilled Migrant Visa", "Business Immigration", "Permanent Residence"],
    rating: 4.8,
    reviews: 89,
    languages: ["English", "Dutch", "French"],
    experience: "12+ years",
    price: "€120/hour",
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Sophie Dubois",
    firm: "Dubois & Associates",
    location: "Paris, France",
    specialties: ["Talent Passport", "Student Visas", "Citizenship Applications"],
    rating: 4.7,
    reviews: 156,
    languages: ["English", "French", "Italian"],
    experience: "10+ years",
    price: "€140/hour",
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Carlos Rodriguez",
    firm: "Rodriguez Immigration Services",
    location: "Barcelona, Spain",
    specialties: ["Work Authorization", "Non-EU Residence", "Investment Visas"],
    rating: 4.6,
    reviews: 73,
    languages: ["English", "Spanish", "Catalan"],
    experience: "8+ years",
    price: "€100/hour",
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Anna Lindqvist",
    firm: "Nordic Immigration Law",
    location: "Stockholm, Sweden",
    specialties: ["Work Permits", "Residence Cards", "Nordic Council Benefits"],
    rating: 4.9,
    reviews: 94,
    languages: ["English", "Swedish", "Norwegian"],
    experience: "11+ years",
    price: "€130/hour",
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Michael O'Connor",
    firm: "Dublin Immigration Experts",
    location: "Dublin, Ireland",
    specialties: ["Critical Skills Visa", "General Work Permits", "EU Treaty Rights"],
    rating: 4.8,
    reviews: 112,
    languages: ["English", "Irish", "Polish"],
    experience: "14+ years",
    price: "€110/hour",
    verified: true,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function LegalSupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")

  const filteredPartners = legalPartners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.firm.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === "All Countries" || partner.location.includes(selectedCountry)
    const matchesSpecialty =
      selectedSpecialty === "All Specialties" ||
      partner.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()))

    return matchesSearch && matchesCountry && matchesSpecialty
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Support Network</h1>
          <p className="text-gray-600">Connect with verified immigration lawyers and legal consultants across Europe</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-gray-600">Verified Partners</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">4.8</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm text-gray-600">Cases Handled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">27</div>
              <div className="text-sm text-gray-600">Countries Covered</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Find Legal Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Lawyer name or firm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Countries">All Countries</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Ireland">Ireland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Specialty</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Specialties">All Specialties</SelectItem>
                      <SelectItem value="Work Visas">Work Visas</SelectItem>
                      <SelectItem value="Blue Card">EU Blue Card</SelectItem>
                      <SelectItem value="Residence">Residence Permits</SelectItem>
                      <SelectItem value="Citizenship">Citizenship</SelectItem>
                      <SelectItem value="Business">Business Immigration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legal Partners */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-600">{filteredPartners.length} legal partners found</p>
            </div>

            <div className="space-y-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Profile Section */}
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={partner.image || "/placeholder.svg"} alt={partner.name} />
                          <AvatarFallback>
                            {partner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{partner.name}</h3>
                            {partner.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 font-medium">{partner.firm}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{partner.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>
                                {partner.rating} ({partner.reviews} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Specialties</h4>
                          <div className="flex flex-wrap gap-2">
                            {partner.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Experience:</span>
                            <span className="ml-2 font-medium">{partner.experience}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Rate:</span>
                            <span className="ml-2 font-medium">{partner.price}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-600 text-sm">Languages:</span>
                          <span className="ml-2 text-sm">{partner.languages.join(", ")}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button className="flex-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Book Consultation
                          </Button>
                          <Button variant="outline">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                          <Button variant="outline" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPartners.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 mb-4">No legal partners found matching your criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCountry("All Countries")
                      setSelectedSpecialty("All Specialties")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
