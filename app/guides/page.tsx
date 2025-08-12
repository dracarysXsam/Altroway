import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const guides = [
  {
    title: "The Ultimate Guide to Relocating to Germany",
    description: "Everything you need to know about visas, housing, banking, and culture in Germany.",
    imageUrl: "/placeholder.svg",
    category: "Country Guide",
    readTime: "15 min read",
  },
  {
    title: "Navigating the Dutch Job Market as an Expat",
    description: "A deep dive into the Netherlands' job market, from resume tips to interview etiquette.",
    imageUrl: "/placeholder.svg",
    category: "Career Advice",
    readTime: "12 min read",
  },
  {
    title: "Understanding the French Healthcare System",
    description: "A simple guide to 'sécurité sociale', 'mutuelles', and getting medical care in France.",
    imageUrl: "/placeholder.svg",
    category: "Healthcare",
    readTime: "10 min read",
  },
  {
    title: "Opening a Bank Account in Spain: A Step-by-Step Guide",
    description: "Learn the requirements and processes for opening a Spanish bank account as a non-resident.",
    imageUrl: "/placeholder.svg",
    category: "Finance",
    readTime: "8 min read",
  },
  {
    title: "Cost of Living in Lisbon vs. Dublin",
    description: "A comparative analysis to help you decide between two of Europe's most popular tech hubs.",
    imageUrl: "/placeholder.svg",
    category: "Lifestyle",
    readTime: "18 min read",
  },
  {
    title: "Your Checklist for the First 30 Days in Sweden",
    description: "From getting your Personnummer to finding your first fika spot, we've got you covered.",
    imageUrl: "/placeholder.svg",
    category: "Relocation",
    readTime: "9 min read",
  },
];

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Altroway Guides</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Your comprehensive resource for navigating the journey to living and working in Europe. From legal requirements to lifestyle tips, we've got you covered.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src={guide.imageUrl}
                  alt={`Image for ${guide.title}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <CardDescription>{guide.category.toUpperCase()}</CardDescription>
                <CardTitle className="text-xl">{guide.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{guide.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{guide.readTime}</span>
                <Button asChild variant="secondary">
                  <Link href="#">Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
