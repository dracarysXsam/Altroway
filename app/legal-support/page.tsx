"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LegalSupportPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Legal Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Navigating the legal requirements for working in a new country can be challenging. Our team of legal
              experts is here to help you with visa applications, work permits, and other legal documents.
            </p>
            <p className="mt-4">
              Please contact us at{" "}
              <a href="mailto:legal@altroway.com" className="text-blue-600">
                legal@altroway.com
              </a>{" "}
              for more information.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
