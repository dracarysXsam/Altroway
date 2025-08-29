"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Users, 
  Eye, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
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
  status: string;
  created_at: string;
  employer_id: string;
}

interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  applied_at: string;
  cover_letter?: string;
  resume_url?: string;
  jobs: Job;
}

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pendingApplications: 0
  });

  useEffect(() => {
    fetchEmployerData();
  }, []);

  const fetchEmployerData = async () => {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get jobs created by this employer
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", user.id)
      .order("created_at", { ascending: false });

    if (jobsData) {
      setJobs(jobsData);
      
      // Get applications for all jobs created by this employer
      const jobIds = jobsData.map(job => job.id);
      if (jobIds.length > 0) {
        const { data: applicationsData } = await supabase
          .from("job_applications")
          .select(`
            *,
            jobs(*)
          `)
          .in("job_id", jobIds)
          .order("applied_at", { ascending: false });

        if (applicationsData) {
          setApplications(applicationsData);
          
          // Calculate stats
          setStats({
            totalJobs: jobsData.length,
            totalApplications: applicationsData.length,
            pendingApplications: applicationsData.filter(app => app.status === "pending").length
          });
        }
      }
    }
    
    setLoading(false);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return "Salary not specified";
    if (min && max) return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
    if (min) return `€${min.toLocaleString()}+`;
    if (max) return `Up to €${max.toLocaleString()}`;
    return "Salary not specified";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case "accepted":
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Accepted</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" />{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">Active job postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">All applications received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Applications to review</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Applications */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Job Applications</h2>
        
        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-4">
                Applications will appear here when job seekers apply to your positions.
              </p>
              <Link href="/employer">
                <Button>Manage Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{application.jobs.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {application.jobs.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {formatSalary(application.jobs.salary_min, application.jobs.salary_max)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {formatDate(application.applied_at)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Applicant ID: {application.applicant_id}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${application.job_id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/messages?job=${application.job_id}&applicant=${application.applicant_id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  {application.cover_letter && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {application.cover_letter}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/employer">
            <Briefcase className="h-4 w-4 mr-2" />
            Manage All Jobs
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/messages">
            <MessageSquare className="h-4 w-4 mr-2" />
            View All Messages
          </Link>
        </Button>
      </div>
    </div>
  );
}
