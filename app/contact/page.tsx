import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Get in Touch</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question, feedback, or need assistance, our team is ready to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="m@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Question about visa applications" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full">
                  Submit Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4">
                <Mail className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle>Email Us</CardTitle>
                  <CardDescription>For general inquiries and support.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <a href="mailto:support@altroway.com" className="text-lg text-gray-800 hover:text-blue-600">
                  support@altroway.com
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4">
                <Phone className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle>Call Us</CardTitle>
                  <CardDescription>Mon-Fri from 9am to 5pm CET.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800">+49 123 456 7890</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-x-4">
                <MapPin className="w-8 h-8 text-blue-600" />
                <div>
                  <CardTitle>Our Office</CardTitle>
                  <CardDescription>Come visit us at our headquarters.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-800">
                  123 Altroway Street, Berlin, 10115, Germany
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
