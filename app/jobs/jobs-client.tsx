"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Clock, Euro, Building, Zap, Bookmark, Heart } from "lucide-react";
import Link from "next/link";
import { saveJob, unsaveJob, checkIfJobSaved } from "@/app/actions/job-actions";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min?: number;
  salary_max?: number;
  job_type: string;
  experience_level: string;
  visa_sponsorship: boolean;
  urgent: boolean;
  industry?: string;
  skills?: string[];
  created_at: string;
};

type JobsClientProps = {
  initialJobs: Job[];
};

export function JobsClient({ initialJobs }: JobsClientProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<Set<string>>(new Set());

  // Check which jobs are saved on component mount
  useEffect(() => {
    const checkSavedJobs = async () => {
      const savedJobIds: string[] = [];
      for (const job of initialJobs) {
        const { isSaved } = await checkIfJobSaved(job.id);
        if (isSaved) {
          savedJobIds.push(job.id);
        }
      }
      setSavedJobs(savedJobIds);
    };

    checkSavedJobs();
  }, [initialJobs]);

  // Persist saved jobs state in localStorage
  useEffect(() => {
    const savedJobsFromStorage = localStorage.getItem('savedJobs');
    if (savedJobsFromStorage) {
      try {
        const parsed = JSON.parse(savedJobsFromStorage);
        setSavedJobs(parsed);
      } catch (error) {
        console.error('Error parsing saved jobs from storage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedJobs changes
  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const handleBookmark = async (jobId: string) => {
    setLoadingJobs(prev => new Set(prev).add(jobId));
    
    try {
      if (savedJobs.includes(jobId)) {
        const result = await unsaveJob(jobId);
        if (result.status === "success") {
          setSavedJobs(prev => prev.filter(id => id !== jobId));
        } else {
          alert(result.message || "Failed to remove job from saved jobs");
        }
      } else {
        const result = await saveJob(jobId);
        if (result.status === "success") {
          setSavedJobs(prev => [...prev, jobId]);
        } else {
          alert(result.message || "Failed to save job");
        }
      }
    } catch (error) {
      console.error("Error toggling job save:", error);
      alert("Failed to update saved jobs");
    } finally {
      setLoadingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = selectedCountry === "All Countries" || job.location.includes(selectedCountry);
    const matchesIndustry = selectedIndustry === "All Industries" || job.industry === selectedIndustry;
    const matchesVisa = !visaSponsorship || job.visa_sponsorship;
    const matchesUrgent = !urgentOnly || job.urgent;

    return matchesSearch && matchesCountry && matchesIndustry && matchesVisa && matchesUrgent;
  });

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
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Job title or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="text-sm font-medium mb-2 block">Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Countries">All Countries</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="Netherlands">Netherlands</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Sweden">Sweden</SelectItem>
                  <SelectItem value="Ireland">Ireland</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Industry */}
            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Industries">All Industries</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="visa-sponsorship" 
                  checked={visaSponsorship} 
                  onCheckedChange={(checked) => setVisaSponsorship(checked as boolean)} 
                />
                <label htmlFor="visa-sponsorship" className="text-sm">
                  Visa Sponsorship Available
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="urgent-hire" 
                  checked={urgentOnly} 
                  onCheckedChange={(checked) => setUrgentOnly(checked as boolean)} 
                />
                <label htmlFor="urgent-hire" className="text-sm">
                  Urgent Hire Only
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setSelectedCountry("All Countries");
                setSelectedIndustry("All Industries");
                setVisaSponsorship(false);
                setUrgentOnly(false);
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">{filteredJobs.length} jobs found</p>
          <Select defaultValue="recent">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
              <SelectItem value="salary-low">Salary: Low to High</SelectItem>
              <SelectItem value="relevance">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCountry("All Countries");
                    setSelectedIndustry("All Industries");
                    setVisaSponsorship(false);
                    setUrgentOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        {job.urgent && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                        {job.visa_sponsorship && <Badge variant="secondary">Visa Sponsorship</Badge>}
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
                        <div className="flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                        </div>
                      </div>
                      <CardDescription className="mb-3 line-clamp-2">
                        {job.description}
                      </CardDescription>
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline">+{job.skills.length - 3} more</Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(job.created_at)}</span>
                        </div>
                        <Badge variant="outline">{job.job_type}</Badge>
                        <Badge variant="outline">{job.experience_level}</Badge>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Link href={`/jobs/${job.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleBookmark(job.id)}
                        disabled={loadingJobs.has(job.id)}
                        className={`${
                          savedJobs.includes(job.id) 
                            ? "text-blue-600 hover:text-blue-700" 
                            : "text-gray-400 hover:text-blue-600"
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
