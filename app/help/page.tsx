"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Help Center</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to the Altroway Help Center. Here you can find answers to frequently asked questions and get in
              touch with our support team.
            </p>
            <p className="mt-4">
              If you need assistance, please email us at{" "}
              <a href="mailto:support@altroway.com" className="text-blue-600">
                support@altroway.com
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
