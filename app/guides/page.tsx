import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Clock, Users, FileText, MapPin, Euro, Calendar, Briefcase, Home } from "lucide-react"
import Link from "next/link"

const countryGuides = [
  {
    id: 1,
    country: "Germany",
    flag: "🇩🇪",
    difficulty: "Medium",
    avgSalary: "€55,000",
    processingTime: "3-6 months",
    popularCities: ["Berlin", "Munich", "Hamburg"],
    visaTypes: ["EU Blue Card", "Work Permit", "Job Seeker Visa"],
    description: "Europe's largest economy with strong job market in tech, engineering, and manufacturing.",
    highlights: ["Strong social benefits", "High job security", "Excellent work-life balance"],
  },
  {
    id: 2,
    country: "Netherlands",
    flag: "🇳🇱",
    difficulty: "Easy",
    avgSalary: "€52,000",
    processingTime: "2-4 months",
    popularCities: ["Amsterdam", "Rotterdam", "The Hague"],
    visaTypes: ["Skilled Migrant Visa", "EU Blue Card", "Startup Visa"],
    description: "Business-friendly environment with excellent English proficiency and international outlook.",
    highlights: ["High English proficiency", "Bike-friendly cities", "Progressive culture"],
  },
  {
    id: 3,
    country: "France",
    flag: "🇫🇷",
    difficulty: "Hard",
    avgSalary: "€45,000",
    processingTime: "4-8 months",
    popularCities: ["Paris", "Lyon", "Toulouse"],
    visaTypes: ["Talent Passport", "Work Permit", "Student Visa"],
    description: "Rich culture and lifestyle with strong emphasis on work-life balance and social benefits.",
    highlights: ["Rich cultural heritage", "Excellent healthcare", "35-hour work week"],
  },
  {
    id: 4,
    country: "Spain",
    flag: "🇪🇸",
    difficulty: "Medium",
    avgSalary: "€35,000",
    processingTime: "3-5 months",
    popularCities: ["Madrid", "Barcelona", "Valencia"],
    visaTypes: ["Work Authorization", "Non-EU Residence", "Investment Visa"],
    description: "Mediterranean lifestyle with growing tech sector and affordable cost of living.",
    highlights: ["Great weather", "Affordable living", "Growing startup scene"],
  },
  {
    id: 5,
    country: "Sweden",
    flag: "🇸🇪",
    difficulty: "Medium",
    avgSalary: "€48,000",
    processingTime: "2-4 months",
    popularCities: ["Stockholm", "Gothenburg", "Malmö"],
    visaTypes: ["Work Permit", "Residence Card", "Nordic Council"],
    description: "Innovation hub with excellent work-life balance and strong social welfare system.",
    highlights: ["Innovation leader", "Parental leave", "Environmental focus"],
  },
  {
    id: 6,
    country: "Ireland",
    flag: "🇮🇪",
    difficulty: "Easy",
    avgSalary: "€50,000",
    processingTime: "2-3 months",
    popularCities: ["Dublin", "Cork", "Galway"],
    visaTypes: ["Critical Skills Visa", "General Work Permit", "EU Treaty Rights"],
    description: "English-speaking country with thriving tech sector and EU access.",
    highlights: ["English speaking", "Tech hub", "EU gateway"],
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Hard":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Country Guides</h1>
          <p className="text-gray-600">Comprehensive relocation guides for European countries</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">27</div>
              <div className="text-sm text-gray-600">Countries Covered</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">150+</div>
              <div className="text-sm text-gray-600">Detailed Guides</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-sm text-gray-600">Users Helped</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">Weekly</div>
              <div className="text-sm text-gray-600">Updates</div>
            </CardContent>
          </Card>
        </div>

        {/* Country Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countryGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{guide.flag}</span>
                    <CardTitle className="text-xl">{guide.country}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
                </div>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-gray-600">Avg Salary</div>
                      <div className="font-medium">{guide.avgSalary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-gray-600">Processing</div>
                      <div className="font-medium">{guide.processingTime}</div>
                    </div>
                  </div>
                </div>

                {/* Popular Cities */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Popular Cities</div>
                  <div className="flex flex-wrap gap-1">
                    {guide.popularCities.map((city) => (
                      <Badge key={city} variant="outline" className="text-xs">
                        {city}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Visa Types */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Visa Types</div>
                  <div className="flex flex-wrap gap-1">
                    {guide.visaTypes.map((visa) => (
                      <Badge key={visa} variant="secondary" className="text-xs">
                        {visa}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Highlights</div>
                  <ul className="text-sm space-y-1">
                    {guide.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" asChild>
                    <Link href={`/guides/${guide.country.toLowerCase()}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Guide
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/jobs?country=${guide.country}`}>
                      <Briefcase className="h-4 w-4 mr-2" />
                      Jobs
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Home className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Housing Guide</CardTitle>
                <CardDescription>Find accommodation and understand rental markets across Europe</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Explore Housing
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Euro className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Cost of Living</CardTitle>
                <CardDescription>Compare living costs and salary expectations in different cities</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  Compare Costs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Document Checklist</CardTitle>
                <CardDescription>Complete checklists for visa applications and legal requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  View Checklists
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
