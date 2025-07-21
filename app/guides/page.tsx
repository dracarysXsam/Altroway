"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Country Guides</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our comprehensive country guides provide you with all the information you need to know about moving to a
              new country. From visa requirements to cost of living, we've got you covered.
            </p>
            <p className="mt-4">
              More guides are coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
