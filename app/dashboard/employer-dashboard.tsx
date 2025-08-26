"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFormState, useFormStatus } from "react-dom";
import { createJob, updateJob, deleteJob } from "@/app/actions/job-actions";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  TrendingUp, 
  Calendar,
  MapPin,
  Euro,
  Building,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  status: string;
  created_at: string;
  applications_count?: number;
  urgent: boolean;
  visa_sponsorship: boolean;
};

type Application = {
  id: string;
  applicant: {
    full_name: string;
    email: string;
  };
  status: string;
  applied_at: string;
  cover_letter?: string;
};

const initialState = {
  message: "",
  status: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Creating Job...
        </>
      ) : (
        "Create Job"
      )}
    </Button>
  );
}

export function EmployerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [state, dispatch] = useFormState(createJob, initialState);
  const supabase = createClient();

  // Form data persistence state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    benefits: "",
    job_type: "Full-time",
    experience_level: "Mid-level",
    visa_sponsorship: false,
    urgent: false,
    industry: "",
    skills: "",
    application_deadline: "",
    salary_min: "",
    salary_max: ""
  });

  // Update form data when user types
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission with data preservation
  const handleFormSubmit = (formDataObj: FormData) => {
    // Update our state with current form values
    const title = formDataObj.get("title") as string;
    const company = formDataObj.get("company") as string;
    const location = formDataObj.get("location") as string;
    const description = formDataObj.get("description") as string;
    const requirements = formDataObj.get("requirements") as string;
    const benefits = formDataObj.get("benefits") as string;
    const job_type = formDataObj.get("job_type") as string;
    const experience_level = formDataObj.get("experience_level") as string;
    const visa_sponsorship = formDataObj.get("visa_sponsorship") === "on";
    const urgent = formDataObj.get("urgent") === "on";
    const industry = formDataObj.get("industry") as string;
    const skills = formDataObj.get("skills") as string;
    const application_deadline = formDataObj.get("application_deadline") as string;
    const salary_min = formDataObj.get("salary_min") as string;
    const salary_max = formDataObj.get("salary_max") as string;

    setFormData({
      title: title || "",
      company: company || "",
      location: location || "",
      description: description || "",
      requirements: requirements || "",
      benefits: benefits || "",
      job_type: job_type || "Full-time",
      experience_level: experience_level || "Mid-level",
      visa_sponsorship,
      urgent,
      industry: industry || "",
      skills: skills || "",
      application_deadline: application_deadline || "",
      salary_min: salary_min || "",
      salary_max: salary_max || ""
    });

    // Call the original dispatch
    dispatch(formDataObj);
  };

  // Debug logging for form state
  useEffect(() => {
    console.log('Form state changed:', state);
  }, [state]);

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  // Handle form state changes
  useEffect(() => {
    if (state.status === "success") {
      setIsCreateDialogOpen(false);
      // Clear form data on success after a delay
      setTimeout(() => {
        setFormData({
          title: "",
          company: "",
          location: "",
          description: "",
          requirements: "",
          benefits: "",
          job_type: "Full-time",
          experience_level: "Mid-level",
          visa_sponsorship: false,
          urgent: false,
          industry: "",
          skills: "",
          application_deadline: "",
          salary_min: "",
          salary_max: ""
        });
        dispatch({ message: "", status: "" });
      }, 2000);
    }
    // On error, form data is preserved automatically
  }, [state.status, dispatch]);

  const fetchJobs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: jobsData } = await supabase
      .from("jobs")
      .select(`
        *,
        applications:job_applications(count)
      `)
      .eq("employer_id", user.id)
      .order("created_at", { ascending: false });

    if (jobsData) {
      setJobs(jobsData.map(job => ({
        ...job,
        applications_count: job.applications?.[0]?.count || 0
      })));
    }
  };

  const fetchApplications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: applicationsData } = await supabase
      .from("job_applications")
      .select(`
        *,
        applicant:profiles!job_applications_applicant_id_fkey(full_name, email)
      `)
      .eq("jobs.employer_id", user.id)
      .order("applied_at", { ascending: false });

    if (applicationsData) {
      setApplications(applicationsData);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      const result = await deleteJob(jobId);
      if (result.status === "success") {
        fetchJobs();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "closed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "reviewed": return "bg-blue-100 text-blue-800";
      case "shortlisted": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "hired": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently posted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Across all jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter(a => a.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired Candidates</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.filter(a => a.status === "hired").length}</div>
            <p className="text-xs text-muted-foreground">Successful hires</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Job Postings</h2>
            <Dialog 
              open={isCreateDialogOpen} 
              onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) {
                  // Reset form state when dialog closes
                  dispatch({ message: "", status: "" });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                 <DialogHeader>
                   <DialogTitle>Create New Job Posting</DialogTitle>
                   <p className="text-sm text-gray-600 mt-2">
                     Fill in the required fields marked with * to create your job posting
                   </p>
                 </DialogHeader>
                                 <form 
                   action={handleFormSubmit} 
                   className="space-y-4"
                   id="create-job-form"
                   onSubmit={(e) => {
                     const formData = new FormData(e.currentTarget);
                     const title = formData.get('title') as string;
                     const company = formData.get('company') as string;
                     const description = formData.get('description') as string;
                     
                     if (!title?.trim() || !company?.trim() || !description?.trim()) {
                       e.preventDefault();
                       alert('Please fill in all required fields (Job Title, Company, and Description)');
                       return false;
                     }
                     
                     if (description.length < 10) {
                       e.preventDefault();
                       alert('Description must be at least 10 characters long');
                       return false;
                     }
                     
                     // Debug logging
                     console.log('Form submitted with:', { title, company, description });
                   }}
                 >
                   {/* Job Title and Company - Required Fields */}
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="title" className="text-red-600 font-medium">
                         Job Title *
                       </Label>
                       <Input 
                         id="title" 
                         name="title" 
                         required 
                         value={formData.title}
                         onChange={(e) => handleInputChange("title", e.target.value)}
                         placeholder="e.g., Senior React Developer"
                         className="border-red-200 focus:border-red-500"
                       />
                     </div>
                     <div>
                       <Label htmlFor="company" className="text-red-600 font-medium">
                         Company *
                       </Label>
                       <Input 
                         id="company" 
                         name="company" 
                         required 
                         value={formData.company}
                         onChange={(e) => handleInputChange("company", e.target.value)}
                         placeholder="e.g., TechCorp GmbH"
                         className="border-red-200 focus:border-red-500"
                       />
                     </div>
                   </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input 
                        id="location" 
                        name="location" 
                        required 
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., Berlin, Germany"
                      />
                    </div>
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry" 
                        name="industry" 
                        value={formData.industry}
                        onChange={(e) => handleInputChange("industry", e.target.value)}
                        placeholder="e.g., Technology, Healthcare, Finance"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salary_min">Min Salary (€)</Label>
                      <Input 
                        id="salary_min" 
                        name="salary_min" 
                        type="number" 
                        value={formData.salary_min}
                        onChange={(e) => handleInputChange("salary_min", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary_max">Max Salary (€)</Label>
                      <Input 
                        id="salary_max" 
                        name="salary_max" 
                        type="number" 
                        value={formData.salary_max}
                        onChange={(e) => handleInputChange("salary_max", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="job_type">Job Type *</Label>
                      <Select 
                        name="job_type" 
                        value={formData.job_type}
                        onValueChange={(value) => handleInputChange("job_type", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experience_level">Experience Level *</Label>
                      <Select 
                        name="experience_level" 
                        value={formData.experience_level}
                        onValueChange={(value) => handleInputChange("experience_level", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry">Entry Level</SelectItem>
                          <SelectItem value="Mid-level">Mid Level</SelectItem>
                          <SelectItem value="Senior">Senior Level</SelectItem>
                          <SelectItem value="Executive">Executive Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      required 
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="min-h-[120px]" 
                      placeholder="Describe the role, responsibilities, and what makes this position exciting. Minimum 10 characters."
                      minLength={10}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Please provide a detailed description of the role and responsibilities. 
                      <span className="text-red-500"> Minimum 10 characters required.</span>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea 
                      id="requirements" 
                      name="requirements" 
                      value={formData.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
                      className="min-h-[80px]" 
                      placeholder="List the key requirements and qualifications for this position"
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea 
                      id="benefits" 
                      name="benefits" 
                      value={formData.benefits}
                      onChange={(e) => handleInputChange("benefits", e.target.value)}
                      className="min-h-[80px]" 
                      placeholder="Describe the benefits and perks offered with this position"
                    />
                  </div>

                  <div>
                    <Label htmlFor="skills">Required Skills</Label>
                    <Input 
                      id="skills" 
                      name="skills" 
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      placeholder="e.g., React, TypeScript, Node.js (comma separated)"
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter skills separated by commas</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="visa_sponsorship" 
                        name="visa_sponsorship" 
                        checked={formData.visa_sponsorship}
                        onCheckedChange={(checked) => handleInputChange("visa_sponsorship", checked as boolean)}
                      />
                      <Label htmlFor="visa_sponsorship">Visa Sponsorship Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="urgent" 
                        name="urgent" 
                        checked={formData.urgent}
                        onCheckedChange={(checked) => handleInputChange("urgent", checked as boolean)}
                      />
                      <Label htmlFor="urgent">Urgent Hire</Label>
                    </div>
                  </div>

                  {state.status === "error" && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Validation Error</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {state.message.split(", ").map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {state.status === "success" && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{state.message}</AlertDescription>
                    </Alert>
                  )}

                                     <SubmitButton />
                   
                   {/* Debug button for testing */}
                   <Button 
                     type="button" 
                     variant="outline" 
                     onClick={() => {
                       const form = document.getElementById('create-job-form') as HTMLFormElement;
                       if (form) {
                         const formData = new FormData(form);
                         console.log('Manual form data check:', {
                           title: formData.get('title'),
                           company: formData.get('company'),
                           description: formData.get('description')
                         });
                       }
                     }}
                   >
                     Debug Form Data
                   </Button>
                 </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.urgent && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                        {job.visa_sponsorship && (
                          <Badge variant="secondary">Visa Sponsorship</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        {(job.salary_min || job.salary_max) && (
                          <div className="flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            <span>
                              {job.salary_min && job.salary_max 
                                ? `€${job.salary_min.toLocaleString()} - €${job.salary_max.toLocaleString()}`
                                : job.salary_min 
                                  ? `€${job.salary_min.toLocaleString()}+`
                                  : `Up to €${job.salary_max?.toLocaleString()}`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{job.applications_count} applications</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {jobs.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                  <p className="text-gray-500 mb-4">Create your first job posting to start attracting candidates</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Job
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <h2 className="text-2xl font-bold">Job Applications</h2>
          
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{application.applicant.full_name}</CardTitle>
                        <Badge className={getApplicationStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <span>{application.applicant.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {application.cover_letter && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {application.cover_letter}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {applications.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-gray-500">Applications will appear here once candidates start applying to your jobs</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
