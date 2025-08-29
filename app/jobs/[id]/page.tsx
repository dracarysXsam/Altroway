import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  Euro, 
  Building, 
  Calendar,
  ArrowLeft,
  Zap,
  Briefcase,
  GraduationCap,
  Globe
} from "lucide-react";
import Link from "next/link";
import { RoleBasedApplicationForm } from "./role-based-application-form";
import { SaveJobButton } from "./save-job-button";
import { JobMessaging } from "./job-messaging";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the specific job
  const { data: job, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !job) {
    notFound();
  }

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    if (min) return `€${min.toLocaleString()}+`;
    if (max) return `Up to €${max.toLocaleString()}`;
    return "Salary not specified";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    const now = new Date();
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return { text: "Expired", color: "bg-red-100 text-red-800" };
    if (diffInDays === 0) return { text: "Today", color: "bg-red-100 text-red-800" };
    if (diffInDays <= 3) return { text: `${diffInDays} days left`, color: "bg-orange-100 text-orange-800" };
    if (diffInDays <= 7) return { text: `${diffInDays} days left`, color: "bg-yellow-100 text-yellow-800" };
    return { text: `${diffInDays} days left`, color: "bg-green-100 text-green-800" };
  };

  const deadline = formatDeadline(job.application_deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      {job.urgent && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Urgent
                        </Badge>
                      )}
                      {job.visa_sponsorship && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Visa Sponsorship
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.job_type}</span>
                      </div>
                    </div>
                    {deadline && (
                      <Badge className={`${deadline.color}`}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {deadline.text}
                      </Badge>
                    )}
                  </div>
                  <SaveJobButton jobId={job.id} />
                </div>
              </CardHeader>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Euro className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    <span>Experience: {job.experience_level}</span>
                  </div>
                  {job.industry && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>Industry: {job.industry}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Posted {formatDate(job.created_at)}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                </div>

                {/* Requirements */}
                {job.requirements && (
                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && (
                  <div>
                    <h3 className="font-semibold mb-2">Benefits</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{job.benefits}</p>
                  </div>
                )}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Application Form */}
            <RoleBasedApplicationForm jobId={job.id} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {job.company}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're looking for talented individuals to join our team and help us grow.
                </p>
              </CardContent>
            </Card>

            {/* Job Messaging */}
            <JobMessaging jobId={job.id} employerId={job.employer_id} />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href={`/jobs/${job.id}#apply`}>
                    Apply Now
                  </Link>
                </Button>
                <SaveJobButton jobId={job.id} variant="outline" />
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/jobs">
                    Browse More Jobs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
