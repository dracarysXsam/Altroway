"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Clock, Euro, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  experience_level: string;
  description?: string;
  created_at: string;
}

interface SavedJobsClientProps {
  initialJobs: Job[];
}

export function SavedJobsClient({ initialJobs }: SavedJobsClientProps) {
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

  return (
    <div className="grid gap-6">
      {initialJobs.map((job) => (
        <Card key={job.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <div className="flex items-center gap-4 text-gray-600">
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
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Posted {formatDate(job.created_at)}</span>
              </div>
            </div>

            {job.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">
                {job.description}
              </p>
            )}

            <div className="flex items-center justify-between">
              <Button asChild>
                <Link href={`/jobs/${job.id}`}>
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
