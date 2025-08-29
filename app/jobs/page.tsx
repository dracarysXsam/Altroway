import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Footer } from "@/components/footer";
import { Search, MapPin, Clock, Euro, Building, Zap, Bookmark } from "lucide-react";
import Link from "next/link";
import { JobsClient } from "./jobs-client";

export default async function JobsPage() {
  const supabase = await createClient();

  // Fetch jobs from database
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error);
    // Return empty array instead of failing
  }

  const jobsList = jobs || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Dream Job in Europe</h1>
          <p className="text-gray-600">Discover thousands of opportunities with visa sponsorship</p>
        </div>

        <JobsClient initialJobs={jobsList} />
      </div>

      <Footer />
    </div>
  );
}
