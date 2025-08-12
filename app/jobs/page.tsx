"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Footer } from "@/components/footer"
import { Search, MapPin, Clock, Euro, Building, Zap, Bookmark } from "lucide-react"
import Link from "next/link"

const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Berlin",
    location: "Berlin, Germany",
    salary: "€70,000 - €90,000",
    type: "Full-time",
    urgent: true,
    visaSponsorship: true,
    description: "Join our innovative team building next-generation software solutions.",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    postedDate: "2 days ago",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Amsterdam, Netherlands",
    salary: "€65,000 - €85,000",
    type: "Full-time",
    urgent: false,
    visaSponsorship: true,
    description: "Lead product strategy and development for our European expansion.",
    skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
    postedDate: "1 week ago",
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataFlow Solutions",
    location: "Paris, France",
    salary: "€60,000 - €80,000",
    type: "Full-time",
    urgent: true,
    visaSponsorship: true,
    description: "Analyze complex datasets to drive business insights and decisions.",
    skills: ["Python", "Machine Learning", "SQL", "Statistics"],
    postedDate: "3 days ago",
  },
  {
    id: 4,
    title: "UX Designer",
    company: "Design Studio Pro",
    location: "Barcelona, Spain",
    salary: "€45,000 - €60,000",
    type: "Full-time",
    urgent: false,
    visaSponsorship: true,
    description: "Create beautiful and intuitive user experiences for our digital products.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    postedDate: "5 days ago",
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Systems",
    location: "Stockholm, Sweden",
    salary: "€75,000 - €95,000",
    type: "Full-time",
    urgent: true,
    visaSponsorship: true,
    description: "Build and maintain scalable cloud infrastructure and deployment pipelines.",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
    postedDate: "1 day ago",
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "Growth Partners",
    location: "Dublin, Ireland",
    salary: "€55,000 - €70,000",
    type: "Full-time",
    urgent: false,
    visaSponsorship: true,
    description: "Drive marketing campaigns and brand growth across European markets.",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    postedDate: "1 week ago",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState("All Countries")
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [visaSponsorship, setVisaSponsorship] = useState(false)
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const handleBookmark = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId))
    } else {
      setSavedJobs([...savedJobs, jobId])
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = selectedCountry === "All Countries" || job.location.includes(selectedCountry)
    const matchesVisa = !visaSponsorship || job.visaSponsorship
    const matchesUrgent = !urgentOnly || job.urgent

    return matchesSearch && matchesCountry && matchesVisa && matchesUrgent
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job in Europe</h1>
          <p className="text-gray-600">Discover thousands of opportunities with visa sponsorship</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Job title or company"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Country */}
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

                {/* Industry */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Industry</label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Industries">All Industries</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="visa-sponsorship" checked={visaSponsorship} onCheckedChange={setVisaSponsorship} />
                    <label htmlFor="visa-sponsorship" className="text-sm">
                      Visa Sponsorship Available
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="urgent-hire" checked={urgentOnly} onCheckedChange={setUrgentOnly} />
                    <label htmlFor="urgent-hire" className="text-sm">
                      Urgent Hire Only
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">{filteredJobs.length} jobs found</p>
              <Select defaultValue="recent">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                  <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          {job.urgent && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              Urgent
                            </Badge>
                          )}
                          {job.visaSponsorship && <Badge variant="secondary">Visa Sponsorship</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                        </div>
                        <CardDescription className="mb-3">{job.description}</CardDescription>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          <span>{job.postedDate}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/jobs/${job.id}/apply`}>
                          <Button size="sm">Apply Now</Button>
                        </Link>
                        <Button size="sm" variant={savedJobs.includes(job.id) ? "default" : "outline"} onClick={() => handleBookmark(job.id)}>
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500 mb-4">No jobs found matching your criteria</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCountry("All Countries")
                      setSelectedIndustry("All Industries")
                      setVisaSponsorship(false)
                      setUrgentOnly(false)
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
