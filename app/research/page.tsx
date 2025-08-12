"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Europe Relocation Research Hub</h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          Your comprehensive guide to living and working in Europe.
        </p>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Country-Specific Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Germany</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    Germany, a popular destination for skilled workers, offers a strong economy and high quality of
                    life. Key industries include engineering, IT, and healthcare.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Visa Requirements:</strong> EU Blue Card for highly skilled non-EU citizens, Jobseeker
                      Visa.
                    </li>
                    <li>
                      <strong>Cost of Living:</strong> Munich and Berlin are major hubs, with varying costs. Generally
                      moderate for a Western European country.
                    </li>
                    <li>
                      <strong>Healthcare:</strong> Mandatory public health insurance system.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Netherlands</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    Known for its innovative culture and English-speaking population, the Netherlands is a top choice
                    for tech professionals and entrepreneurs.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Visa Requirements:</strong> Highly Skilled Migrant visa, Orientation Year visa for
                      graduates.
                    </li>
                    <li>
                      <strong>Cost of Living:</strong> Amsterdam is expensive, but cities like Rotterdam and Utrecht
                      are more affordable.
                    </li>
                    <li>
                      <strong>30% Ruling:</strong> A tax advantage for certain skilled migrants.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Spain</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4">
                    Spain offers a vibrant lifestyle and a growing tech scene, especially in Barcelona and Madrid.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Visa Requirements:</strong> Work Visa (requires a job offer), Digital Nomad Visa.
                    </li>
                    <li>
                      <strong>Cost of Living:</strong> Generally lower than in Northern European countries.
                    </li>
                    <li>
                      <strong>Culture:</strong> Rich history, delicious food, and a relaxed pace of life.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>General Relocation Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Finding Accommodation</h3>
                <p>
                  Learn about rental markets, common housing platforms (e.g., Idealista, Immobilienscout24), and tenant
                  rights in different countries.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Banking & Finances</h3>
                <p>
                  How to open a bank account, manage international money transfers, and understand local tax systems.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cultural Integration</h3>
                <p>
                  Tips for learning the local language, understanding business etiquette, and building a social
                  network.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Healthcare Systems</h3>
                <p>
                  An overview of public vs. private healthcare, insurance requirements, and accessing medical services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
