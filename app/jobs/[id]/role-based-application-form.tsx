"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { JobApplicationForm } from "./job-application-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Briefcase, UserCheck } from "lucide-react";
import Link from "next/link";

interface RoleBasedApplicationFormProps {
  jobId: string;
}

export function RoleBasedApplicationForm({ jobId }: RoleBasedApplicationFormProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployer, setIsEmployer] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .single();

        setUserRole(profile?.role || "job_seeker");
        
        // Check if user is the employer of this job
        const { data: job } = await supabase
          .from("jobs")
          .select("employer_id")
          .eq("id", jobId)
          .single();

        setIsEmployer(job?.employer_id === user.id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        setUserRole("job_seeker");
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, [jobId, supabase]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user is not authenticated, show login prompt
  if (!userRole) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Apply for this Job
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be logged in to apply for this job.
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Login to Apply</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user is an employer (recruiter), show different message
  if (userRole === "employer" || userRole === "super_admin") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Employer Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isEmployer 
                ? "You cannot apply to your own job posting. Use the employer portal to manage applications."
                : "Employers cannot apply to job postings. Use the employer portal to post your own jobs."
              }
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link href="/employer">
                Go to Employer Portal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If user is a legal advisor, show different message
  if (userRole === "legal_advisor") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Legal Advisor Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Legal advisors provide support and guidance but cannot apply to job postings. 
              Use the legal support portal to help job seekers.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button asChild className="w-full">
              <Link href="/legal-support">
                Go to Legal Support Portal
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For job seekers, show the application form
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Apply for this Job
        </CardTitle>
      </CardHeader>
      <CardContent>
        <JobApplicationForm jobId={jobId} />
      </CardContent>
    </Card>
  );
}
