"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield, FileText, Briefcase } from "lucide-react"

export default function LegalSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold">Legal & Visa Support</h1>
          <p className="text-xl text-gray-600 mt-2">
            Navigating the legal landscape of European immigration.
          </p>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Our Legal Support Services</CardTitle>
            <CardDescription>
              We connect you with a network of experienced immigration lawyers and specialists across Europe.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <FileText className="h-10 w-10 text-green-600 mb-2" />
              <h3 className="font-semibold">Document Review</h3>
              <p className="text-sm text-gray-600">
                Ensure your visa and work permit applications are accurate and complete.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Briefcase className="h-10 w-10 text-purple-600 mb-2" />
              <h3 className="font-semibold">Application Assistance</h3>
              <p className="text-sm text-gray-600">
                Step-by-step guidance through the entire application process.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-10 w-10 text-red-600 mb-2" />
              <h3 className="font-semibold">Legal Consultation</h3>
              <p className="text-sm text-gray-600">
                Personalized advice on complex immigration cases and appeals.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Legal Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Types of Work Visas</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    The type of visa you need depends on your nationality, skills, and the country you plan to work
                    in. Common types include:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>EU Blue Card:</strong> A work and residence permit for highly-qualified, non-EU
                      citizens. It is recognized in 25 of the 27 EU member states.
                    </li>
                    <li>
                      <strong>National Work Visas:</strong> Issued by individual countries for specific types of
                      employment. Often tied to a specific employer.
                    </li>
                    <li>
                      <strong>Digital Nomad Visas:</strong> A newer category for remote workers employed by companies
                      outside the host country.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Work Permits vs. Residency Permits</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    It's crucial to understand the difference:
                  </p>
                  <p className="mb-2">
                    <strong>Work Permit:</strong> Grants you the right to take up a specific job in a country. It is
                    often tied to your employer.
                  </p>
                  <p>
                    <strong>Residency Permit:</strong> Allows you to live in a country for a specified period. It may
                    or may not include the right to work. Often, a work visa will lead to a temporary residency
                    permit.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Family Reunification</AccordionTrigger>
                <AccordionContent>
                  <p>
                    Most European countries have provisions for visa holders to bring their immediate family members
                    (spouse and minor children). The process and requirements vary significantly by country and visa
                    type. It's essential to check the specific rules for your destination country.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle>Get Personalized Legal Help</CardTitle>
            <CardDescription>
              For specific questions about your situation, please reach out.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>
              Contact us at{" "}
              <a href="mailto:legal@altroway.com" className="text-blue-600 font-semibold">
                legal@altroway.com
              </a>{" "}
              or book a consultation through your dashboard.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
