"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By using our platform, you agree to be bound by our terms of service.
            </p>
            <p className="mt-4">
              You agree not to use our platform for any illegal or unauthorized purpose. You also agree not to misuse
              our platform by interfering with its normal operation or attempting to access it using a method other
              than through the interfaces and instructions that we provide.
            </p>
            <p className="mt-4">
              We may suspend or stop providing our services to you if you do not comply with our terms or policies or
              if we are investigating suspected misconduct.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
