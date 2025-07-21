"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Have a question or need to get in touch? You can reach us by email or phone.
            </p>
            <p className="mt-4">
              <strong>Email:</strong>{" "}
              <a href="mailto:support@altroway.com" className="text-blue-600">
                support@altroway.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
