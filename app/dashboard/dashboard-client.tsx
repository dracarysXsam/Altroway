"use client";

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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Define types for the data props
type Application = {
  id: string;
  job_title: string;
  company: string;
  location: string;
  status: string;
  applied_date: string;
};

type Document = {
  id: string;
  name: string;
  type: string;
  status: string;
};

type DashboardClientProps = {
  applications: Application[];
  documents: Document[];
  profileCompletion: number;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Verified":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "Processing":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Pending":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Review":
      return "bg-yellow-500";
    case "Interview Scheduled":
      return "bg-blue-500";
    case "Rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export function DashboardClient({ applications, documents, profileCompletion }: DashboardClientProps) {
  return (
    <Tabs defaultValue="applications" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
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
              {applications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(app.status)}`}></div>
                    <div>
                      <h3 className="font-semibold">{app.job_title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Building className="h-4 w-4" />
                          <span>{app.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{app.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Applied {new Date(app.applied_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{app.status}</Badge>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Documents Tab */}
      <TabsContent value="documents">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Status</CardTitle>
              <CardDescription>Manage and track your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-sm">{doc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Upload new documents or manage existing ones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="file" id="file-upload" className="hidden" />
              <Label htmlFor="file-upload" className="w-full">
                <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                  <div>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Document
                  </div>
                </Button>
              </Label>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Visa Application
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Document Package
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview Documents
              </Button>
            </CardContent>
          </Card>
        </div>
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
              <Button variant="outline" className="w-full bg-transparent">
                Browse Guides
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Legal Support</CardTitle>
              <CardDescription>Connect with immigration lawyers and consultants</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                Find Legal Help
              </Button>
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
