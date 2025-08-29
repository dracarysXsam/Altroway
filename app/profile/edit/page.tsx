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
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    avatar_url: "",
    role: "job_seeker"
  });

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Authentication Error",
            description: "Please log in to edit your profile.",
            variant: "destructive"
          });
          router.push("/login");
          return;
        }

        // Get the profile data
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error loading profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data. Please try again.",
            variant: "destructive"
          });
          return;
        }

        // Populate form with existing data or user data
        setFormData({
          full_name: profile?.full_name || user.user_metadata?.full_name || "",
          email: user.email || "",
          headline: profile?.headline || "",
          bio: profile?.bio || "",
          location: profile?.location || "",
          phone: profile?.phone || "",
          avatar_url: profile?.avatar_url || user.user_metadata?.avatar_url || "",
          role: profile?.role || "job_seeker"
        });
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadProfileData();
  }, [supabase, router, toast]);

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
          description: "Please log in to update your profile.",
          variant: "destructive"
        });
        return;
      }

      // Update user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          avatar_url: formData.avatar_url
        }
      });

      if (authError) {
        throw authError;
      }

      // Update or insert profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: user.id,
          full_name: formData.full_name,
          email: formData.email,
          headline: formData.headline,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          avatar_url: formData.avatar_url,
          role: formData.role,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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
          <span>Loading profile data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your personal information and preferences</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Keep your profile up to date to help employers and recruiters find you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="e.g., John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="e.g., john@example.com"
                      required
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      id="headline"
                      value={formData.headline}
                      onChange={(e) => handleInputChange("headline", e.target.value)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job_seeker">Job Seeker</SelectItem>
                        <SelectItem value="employer">Employer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g., Berlin, Germany"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="e.g., +49 123 456 789"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-2">
                  <Label htmlFor="avatar_url">Profile Picture URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="avatar_url"
                      value={formData.avatar_url}
                      onChange={(e) => handleInputChange("avatar_url", e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Enter a URL for your profile picture</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Tell us about yourself, your experience, and what you're looking for..."
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
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                  
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
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
