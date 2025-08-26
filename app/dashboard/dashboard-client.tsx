"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  Eye,
  Download,
  MapPin,
  Building,
  Calendar,
  Users,
  BookOpen,
  Briefcase,
  Search,
  Heart,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DocumentUploadForm } from "./document-upload-form";

// Define types for the data props
type JobApplication = {
  id: string;
  job_id: string;
  applicant_id: string;
  cover_letter: string;
  resume_path: string;
  status: string;
  applied_at: string;
  job?: {
    title: string;
    company: string;
    location: string;
  };
};

type SavedJob = {
  id: string;
  user_id: string;
  job_id: string;
  saved_at: string;
  job?: {
    title: string;
    company: string;
    location: string;
  };
};

type RecentJob = {
  id: string;
  title: string;
  company: string;
  location: string;
};

type DashboardClientProps = {
  jobApplications: JobApplication[];
  savedJobs: SavedJob[];
  recentJobs: RecentJob[];
  profileCompletion: number;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "accepted":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function DashboardClient({ jobApplications, savedJobs, recentJobs, profileCompletion }: DashboardClientProps) {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  return (
    <Tabs defaultValue="applications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>

      {/* Applications Tab */}
      <TabsContent value="applications">
        <Card>
          <CardHeader>
            <CardTitle>Your Job Applications</CardTitle>
            <CardDescription>Track the status of your job applications across Europe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobApplications.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-4">Start applying to jobs to track your progress here</p>
                  <Link href="/jobs">
                    <Button>
                      <Search className="mr-2 h-4 w-4" />
                      Browse Jobs
                    </Button>
                  </Link>
                </div>
              ) : (
                jobApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(app.status)}`}></div>
                      <div>
                        <h3 className="font-semibold">{app.job?.title || "Job Title"}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4" />
                            <span>{app.job?.company || "Company"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{app.job?.location || "Location"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Applied {new Date(app.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">{app.status}</Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Saved Jobs Tab */}
      <TabsContent value="saved">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Jobs</CardTitle>
              <CardDescription>Jobs you've saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No saved jobs</h3>
                    <p className="text-gray-600 mb-4">Save jobs you're interested in to view them here</p>
                    <Link href="/jobs">
                      <Button>
                        <Search className="mr-2 h-4 w-4" />
                        Browse Jobs
                      </Button>
                    </Link>
                  </div>
                ) : (
                  savedJobs.map((saved) => (
                    <div key={saved.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-5 w-5 text-red-500" />
                        <div>
                          <h4 className="font-medium">{saved.job?.title || "Job Title"}</h4>
                          <p className="text-sm text-gray-600">{saved.job?.company || "Company"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Apply Now
                        </Button>
                        <Button size="sm" variant="ghost">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Job Opportunities</CardTitle>
              <CardDescription>Latest job postings that might interest you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
              <Link href="/jobs">
                <Button className="w-full" variant="outline">
                  View All Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Messages Tab */}
      <TabsContent value="messages">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communicate with employers and applicants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600 mb-4">View and manage your conversations with employers and applicants</p>
              <Link href="/messages">
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Messages
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile Completion</CardTitle>
            <CardDescription>Complete your profile to improve your job matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="mb-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personal Information</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Work Experience</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Education</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Skills & Languages</span>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Preferences</span>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Portfolio</span>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              </div>

              <Link href="/profile/edit">
                <Button className="w-full">Complete Profile</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Resources Tab */}
      <TabsContent value="resources">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Country Guides</CardTitle>
              <CardDescription>Comprehensive guides for each European country</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/research">
                <Button variant="outline" className="w-full bg-transparent">
                  Browse Guides
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Legal Support</CardTitle>
              <CardDescription>Connect with immigration lawyers and consultants</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/legal-support">
                <Button variant="outline" className="w-full bg-transparent">
                  Find Legal Help
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Download templates for visa and work permit applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Download Templates
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
