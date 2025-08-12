"use client"

import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your privacy is important to us. This privacy policy explains how we collect, use, and protect your
              personal information.
            </p>
            <p className="mt-4">
              We collect information that you provide to us when you create an account, such as your name, email
              address, and resume. We use this information to provide you with our services and to improve your
              experience on our platform.
            </p>
            <p className="mt-4">
              We do not share your personal information with third parties without your consent, except as required by
              law.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
