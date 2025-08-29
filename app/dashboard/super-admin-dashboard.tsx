"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email?: string;
  user_metadata: {
    role?: string;
    full_name?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  created_at: string;
  employer_id: string;
}

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  applied_at: string;
  job: Job;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export function SuperAdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalMessages: 0,
    activeJobs: 0,
    pendingApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const supabase = createClient();
    
    try {
      // Fetch all data in parallel
      const [usersData, jobsData, applicationsData, messagesData] = await Promise.all([
        supabase.auth.admin.listUsers(),
        supabase.from("jobs").select("*"),
        supabase.from("job_applications").select(`
          *,
          jobs (*)
        `),
        supabase.from("messages").select("*")
      ]);

      if (usersData.data) {
        setUsers(usersData.data.users as User[]);
      }

      if (jobsData.data) {
        setJobs(jobsData.data);
      }

      if (applicationsData.data) {
        setApplications(applicationsData.data);
      }

      if (messagesData.data) {
        setMessages(messagesData.data);
      }

      // Calculate stats
      const activeJobs = jobsData.data?.filter(job => job.status === 'active').length || 0;
      const pendingApplications = applicationsData.data?.filter(app => app.status === 'pending').length || 0;

      setStats({
        totalUsers: usersData.data?.users.length || 0,
        totalJobs: jobsData.data?.length || 0,
        totalApplications: applicationsData.data?.length || 0,
        totalMessages: messagesData.data?.length || 0,
        activeJobs,
        pendingApplications
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole }
      });

      if (error) {
        console.error("Error updating user role:", error);
        return;
      }

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from("jobs")
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) {
        console.error("Error updating job status:", error);
        return;
      }

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) {
        console.error("Error updating application status:", error);
        return;
      }

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const deleteJob = async (jobId: string) => {
    const supabase = createClient();
    
    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId);

      if (error) {
        console.error("Error deleting job:", error);
        return;
      }

      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'employer': return 'bg-blue-100 text-blue-800';
      case 'job_seeker': return 'bg-green-100 text-green-800';
      case 'legal_advisor': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading Super Admin Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete system overview and management</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="h-4 w-4 mr-2" />
          Super Admin
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalJobs} total jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApplications} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">
              Total conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all users and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-muted-foreground">
                          Created: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(user.user_metadata?.role || 'unknown')}>
                        {user.user_metadata?.role || 'No Role'}
                      </Badge>
                      <select
                        value={user.user_metadata?.role || ''}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="">Select Role</option>
                        <option value="job_seeker">Job Seeker</option>
                        <option value="employer">Employer</option>
                        <option value="legal_advisor">Legal Advisor</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Jobs Management */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Job Management</CardTitle>
                  <CardDescription>Manage all job postings</CardDescription>
                </div>
                <Button asChild>
                  <Link href="/admin/jobs/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Job
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.company} • {job.location}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                      </select>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/jobs/${job.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteJob(job.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Management */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>Review and manage job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{application.job?.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {application.job?.company} • {application.job?.location}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Applied: {new Date(application.applied_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                      <select
                        value={application.status}
                        onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="interview">Interview</option>
                      </select>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/applications/${application.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Management */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Management</CardTitle>
              <CardDescription>Monitor system messages and conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.slice(0, 10).map((message) => (
                  <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">
                          {message.content.length > 50 
                            ? `${message.content.substring(0, 50)}...` 
                            : message.content
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Sender: {message.sender_id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/messages/${message.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link href="/admin/users">
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link href="/admin/jobs">
                <Briefcase className="h-6 w-6 mb-2" />
                Manage Jobs
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link href="/admin/applications">
                <FileText className="h-6 w-6 mb-2" />
                Review Applications
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-20 flex-col">
              <Link href="/admin/settings">
                <Settings className="h-6 w-6 mb-2" />
                System Settings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
