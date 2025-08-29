'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  FileText, 
  MessageSquare, 
  User, 
  Building2,
  Shield,
  Settings,
  Activity
} from 'lucide-react';
import { EmployerDashboard } from './employer-dashboard';
import { SuperAdminDashboard } from './super-admin-dashboard';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  headline?: string;
  skills?: string;
  avatar_url?: string;
  portfolio_url?: string;
  is_active: boolean;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  is_verified: boolean;
  created_at: string;
}

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  applied_at: string;
  job: Job;
}

interface Conversation {
  id: string;
  job_application_id: string;
  created_at: string;
  job_application: {
    job: Job;
    applicant: Profile;
  };
}

interface DashboardData {
  profile: Profile;
  jobs: Job[];
  applications: Application[];
  conversations: Conversation[];
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!data || !data.profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // If user is super admin, show super admin dashboard
  if (data.profile.role === 'super_admin') {
    return <SuperAdminDashboard />;
  }

  // If user is employer, show employer dashboard
  if (data.profile.role === 'employer') {
    return <EmployerDashboard />;
  }

  // Default job seeker dashboard
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {data.profile.full_name}!</h1>
          <p className="text-muted-foreground">Manage your job search and applications</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {data.profile.role === 'job_seeker' ? 'Job Seeker' : 'Legal Provider'}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.applications.length}</div>
                <p className="text-xs text-muted-foreground">
                  {data.applications.filter(a => a.status === 'pending').length} pending
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.conversations.length}</div>
                <p className="text-xs text-muted-foreground">
                  Ongoing discussions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Complete</div>
                <p className="text-xs text-muted-foreground">
                  Profile is up to date
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">
                  Account is active
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Your latest job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.applications.slice(0, 3).map((application) => (
                    <div key={application.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{application.job?.title || 'Job Title Not Available'}</span>
                      <Badge variant="secondary">{application.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Browse Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Applications</CardTitle>
              <CardDescription>Track your job application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{application.job?.title || 'Job Title Not Available'}</div>
                        <div className="text-sm text-muted-foreground">{application.job?.company || 'Company'} • {application.job?.location || 'Location'}</div>
                        <div className="text-xs text-muted-foreground">
                          Applied: {new Date(application.applied_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={application.status === 'pending' ? 'secondary' : 'default'}>
                      {application.status}
                    </Badge>
                  </div>
                ))}
                {data.applications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No applications yet. Start applying to jobs!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>Communicate with employers about your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.conversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{conversation.job_application?.job?.title || 'Job Title Not Available'}</div>
                        <div className="text-sm text-muted-foreground">
                          {conversation.job_application?.job?.company || 'Company'} • {conversation.job_application?.job?.location || 'Location'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Started: {new Date(conversation.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      View Messages
                    </Button>
                  </div>
                ))}
                {data.conversations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No conversations yet. Messages will appear here when employers respond to your applications.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your professional profile and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="text-sm text-muted-foreground">{data.profile.full_name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <div className="text-sm text-muted-foreground">{data.profile.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Headline</label>
                    <div className="text-sm text-muted-foreground">{data.profile.headline || 'Not set'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Skills</label>
                    <div className="text-sm text-muted-foreground">{data.profile.skills || 'Not set'}</div>
                  </div>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
