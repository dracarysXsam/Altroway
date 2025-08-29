"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [jobId, setJobId] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    job_type: "full-time",
    experience_level: "entry",
    status: "active"
  });

  useEffect(() => {
    const loadJobData = async () => {
      try {
        const { id } = await params;
        setJobId(id);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "Please log in to edit this job posting.",
            variant: "destructive"
          });
          router.push("/login");
          return;
        }

        // Get the job details
        const { data: job, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !job) {
          toast({
            title: "Error",
            description: "Job not found or you don't have permission to edit it.",
            variant: "destructive"
          });
          router.push("/employer");
          return;
        }

        // Check if user owns this job
        if (job.employer_id !== user.id) {
          toast({
            title: "Permission Error",
            description: "You don't have permission to edit this job posting.",
            variant: "destructive"
          });
          router.push("/employer");
          return;
        }

        // Populate form with existing data
        setFormData({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          description: job.description || "",
          requirements: job.requirements || "",
          salary_min: job.salary_min?.toString() || "",
          salary_max: job.salary_max?.toString() || "",
          job_type: job.job_type || "full-time",
          experience_level: job.experience_level || "entry",
          status: job.status || "active"
        });
      } catch (error) {
        console.error("Error loading job data:", error);
        toast({
          title: "Error",
          description: "Failed to load job data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadJobData();
  }, [params, supabase, router, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to update this job posting.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("jobs")
        .update({
          ...formData,
          salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
          updated_at: new Date().toISOString()
        })
        .eq("id", jobId)
        .eq("employer_id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Job posting updated successfully!",
      });

      router.push(`/employer/jobs/${jobId}`);
    } catch (error) {
      console.error("Error updating job:", error);
      toast({
        title: "Error",
        description: "Failed to update job posting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to delete this job posting.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", jobId)
        .eq("employer_id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Job posting deleted successfully!",
      });

      router.push("/employer");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast({
        title: "Error",
        description: "Failed to delete job posting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading job data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/employer/jobs/${jobId}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Job Details
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job Posting</h1>
              <p className="text-gray-600">Update the job details below</p>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Job
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Update the information about this position to attract the best candidates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="e.g., Tech Corp"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., New York, NY or Remote"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_type">Job Type *</Label>
                    <Select value={formData.job_type} onValueChange={(value) => handleInputChange("job_type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level *</Label>
                    <Select value={formData.experience_level} onValueChange={(value) => handleInputChange("experience_level", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Salary Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary_min">Minimum Salary (€)</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => handleInputChange("salary_min", e.target.value)}
                      placeholder="e.g., 50000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary_max">Maximum Salary (€)</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      value={formData.salary_max}
                      onChange={(e) => handleInputChange("salary_max", e.target.value)}
                      placeholder="e.g., 80000"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide a detailed description of the role, responsibilities, and what makes this position exciting..."
                    rows={6}
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements & Qualifications</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    placeholder="List the required skills, experience, education, and any other qualifications..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {isLoading ? "Updating..." : "Update Job Posting"}
                  </Button>
                  
                  <Button type="button" variant="outline" onClick={() => router.push(`/employer/jobs/${jobId}`)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
