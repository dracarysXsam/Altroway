"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MapPin, Building, Link as LinkIcon } from "lucide-react"

// Mock data for a company profile
const company = {
  id: 1,
  name: "TechCorp Berlin",
  logo: "/placeholder-logo.png",
  location: "Berlin, Germany",
  website: "https://example.com",
  description:
    "TechCorp Berlin is a leading technology company specializing in innovative software solutions. We are committed to creating a diverse and inclusive workplace where everyone can thrive.",
  jobs: [
    {
      id: 1,
      title: "Senior Software Engineer",
      location: "Berlin, Germany",
    },
    {
      id: 2,
      title: "Frontend Developer",
      location: "Berlin, Germany",
    },
  ],
}

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={company.logo} alt={company.name} />
              <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{company.name}</CardTitle>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{company.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{company.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon className="h-4 w-4" />
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600">
                    Website
                  </a>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p className="text-gray-600 mb-6">{company.description}</p>

            <h3 className="text-lg font-semibold mb-2">Open Positions</h3>
            <div className="space-y-4">
              {company.jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                  <Button size="sm">View Job</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
