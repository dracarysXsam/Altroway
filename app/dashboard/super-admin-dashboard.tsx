'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Settings, 
  Activity, 
  Shield, 
  Trash2, 
  Edit, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserPlus,
  Database,
  BarChart3
} from 'lucide-react';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  is_verified: boolean;
  employer_id: string;
  created_at: string;
}

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  applied_at: string;
  job: Job;
  applicant: Profile;
}

interface SystemLog {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id: string;
  created_at: string;
  user: Profile;
}

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string;
  is_public: boolean;
}

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState(false);
  const [isEditSettingOpen, setIsEditSettingOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SiteSetting | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data for super admin
      const [profilesRes, jobsRes, applicationsRes, logsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/profiles'),
        fetch('/api/admin/jobs'),
        fetch('/api/admin/applications'),
        fetch('/api/admin/logs'),
        fetch('/api/admin/settings')
      ]);

      if (profilesRes.ok) setProfiles(await profilesRes.json());
      if (jobsRes.ok) setJobs(await jobsRes.json());
      if (applicationsRes.ok) setApplications(await applicationsRes.json());
      if (logsRes.ok) setSystemLogs(await logsRes.json());
      if (settingsRes.ok) setSiteSettings(await settingsRes.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchData();
        setIsEditProfileOpen(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const updateJob = async (jobId: string, updates: Partial<Job>) => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchData();
        setIsEditJobOpen(false);
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const updateSetting = async (settingId: string, updates: Partial<SiteSetting>) => {
    try {
      const response = await fetch(`/api/admin/settings/${settingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        fetchData();
        setIsEditSettingOpen(false);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const deleteProfile = async (profileId: string) => {
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const getStats = () => {
    const totalUsers = profiles.length;
    const activeUsers = profiles.filter(p => p.is_active).length;
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'active').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const verifiedJobs = jobs.filter(j => j.is_verified).length;

    return {
      totalUsers,
      activeUsers,
      totalJobs,
      activeJobs,
      totalApplications,
      pendingApplications,
      verifiedJobs
    };
  };

  const stats = getStats();

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
          <p className="text-muted-foreground">Complete control over the entire system</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="w-4 h-4 mr-2" />
          Super Admin
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeJobs} active, {stats.verifiedJobs} verified
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
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">
                  All systems operational
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New User
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Pending Jobs
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="w-4 h-4 mr-2" />
                  Backup Database
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{profile.full_name}</div>
                        <div className="text-sm text-muted-foreground">{profile.email}</div>
                        <Badge variant={profile.role === 'super_admin' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProfile(profile);
                          setIsEditProfileOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteProfile(profile.id)}
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

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Management</CardTitle>
              <CardDescription>Manage all job postings and verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{job.company} • {job.location}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status}
                          </Badge>
                          {job.is_verified ? (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsEditJobOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteJob(job.id)}
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

        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>Monitor all job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{application.job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Applicant: {application.applicant.full_name}
                        </div>
                        <Badge variant="secondary">{application.status}</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Monitor all system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{log.action}</Badge>
                      <span className="text-sm font-medium">{log.table_name}</span>
                      <span className="text-xs text-muted-foreground">{log.record_id}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>Configure system-wide settings and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {siteSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{setting.setting_key}</div>
                      <div className="text-sm text-muted-foreground">{setting.description}</div>
                      <div className="text-sm font-mono bg-muted p-1 rounded mt-1">
                        {setting.setting_value}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSetting(setting);
                        setIsEditSettingOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Comprehensive system performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">User Growth</h4>
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Job Posting Trends</h4>
                  <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update user profile information and role</DialogDescription>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  defaultValue={selectedProfile.full_name}
                  onChange={(e) => setSelectedProfile({...selectedProfile, full_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedProfile.role}
                  onValueChange={(value) => setSelectedProfile({...selectedProfile, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_seeker">Job Seeker</SelectItem>
                    <SelectItem value="employer">Employer</SelectItem>
                    <SelectItem value="legal_provider">Legal Provider</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={selectedProfile.is_active}
                  onChange={(e) => setSelectedProfile({...selectedProfile, is_active: e.target.checked})}
                />
                <Label htmlFor="is_active">Active Account</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateProfile(selectedProfile.id, selectedProfile)}>
                  Update Profile
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>Update job information and status</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedJob.status}
                  onValueChange={(value) => setSelectedJob({...selectedJob, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={selectedJob.is_verified}
                  onChange={(e) => setSelectedJob({...selectedJob, is_verified: e.target.checked})}
                />
                <Label htmlFor="is_verified">Verified Job</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditJobOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateJob(selectedJob.id, selectedJob)}>
                  Update Job
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={isEditSettingOpen} onOpenChange={setIsEditSettingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>Update system configuration</DialogDescription>
          </DialogHeader>
          {selectedSetting && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="setting_value">Value</Label>
                <Input
                  id="setting_value"
                  defaultValue={selectedSetting.setting_value}
                  onChange={(e) => setSelectedSetting({...selectedSetting, setting_value: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditSettingOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => updateSetting(selectedSetting.id, selectedSetting)}>
                  Update Setting
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
