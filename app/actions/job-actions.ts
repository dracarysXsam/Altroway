"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const JobSchema = z.object({
  title: z.string().min(1, { message: "Job title is required." }),
  company: z.string().min(1, { message: "Company name is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
  job_type: z.enum(["Full-time", "Part-time", "Contract", "Internship"]).default("Full-time"),
  experience_level: z.enum(["Entry", "Mid-level", "Senior", "Executive"]).default("Mid-level"),
  visa_sponsorship: z.boolean().default(false),
  urgent: z.boolean().default(false),
  industry: z.string().optional(),
  skills: z.array(z.string()).optional(),
  application_deadline: z.string().optional(),
});

export async function createJob(prevState: any, formData: FormData) {
  try {
    // Debug logging
    console.log("createJob called with:", { prevState, formDataType: typeof formData });
    
    if (!formData || typeof formData.get !== 'function') {
      console.error("Invalid formData:", formData);
      return { message: "Invalid form data received", status: "error" };
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Authentication required.", status: "error" };
    }

    // Check if user is an employer
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "employer") {
      return { message: "Only employers can create job postings.", status: "error" };
    }

    // Extract form data with error handling
    const title = formData.get("title") as string;
    const company = formData.get("company") as string;
    const location = formData.get("location") as string;
    const salary_min = formData.get("salary_min") ? parseInt(formData.get("salary_min") as string) : undefined;
    const salary_max = formData.get("salary_max") ? parseInt(formData.get("salary_max") as string) : undefined;
    const description = formData.get("description") as string;
    const requirements = formData.get("requirements") as string;
    const benefits = formData.get("benefits") as string;
    const job_type = formData.get("job_type") as string;
    const experience_level = formData.get("experience_level") as string;
    const visa_sponsorship = formData.get("visa_sponsorship") === "on";
    const urgent = formData.get("urgent") === "on";
    const industry = formData.get("industry") as string;
    const skills = formData.get("skills") ? (formData.get("skills") as string).split(",").map(s => s.trim()) : [];
    const application_deadline = formData.get("application_deadline") as string;
    const application_deadline_clean = application_deadline && application_deadline.trim() !== "" ? application_deadline : undefined;

    // Debug logging
    console.log("Extracted form data:", {
      title, company, location, description, job_type, experience_level, application_deadline: application_deadline_clean
    });

    const validatedFields = JobSchema.safeParse({
      title,
      company,
      location,
      salary_min,
      salary_max,
      description,
      requirements,
      benefits,
      job_type,
      experience_level,
      visa_sponsorship,
      urgent,
      industry,
      skills,
      application_deadline: application_deadline_clean,
    });

    if (!validatedFields.success) {
      console.error("Validation failed:", validatedFields.error);
      return {
        message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(", "),
        status: "error",
      };
    }

    const jobData = validatedFields.data;

    const { error } = await supabase
      .from("jobs")
      .insert({
        employer_id: user.id,
        ...jobData,
      });

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to create job: ${error.message}`, status: "error" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/jobs");

    return { message: "Job created successfully!", status: "success" };
  } catch (error) {
    console.error("createJob error:", error);
    return { message: "Failed to process job creation", status: "error" };
  }
}

export async function updateJob(jobId: string, prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Authentication required.", status: "error" };
    }

    const validatedFields = JobSchema.safeParse({
      title: formData.get("title"),
      company: formData.get("company"),
      location: formData.get("location"),
      salary_min: formData.get("salary_min") ? parseInt(formData.get("salary_min") as string) : undefined,
      salary_max: formData.get("salary_max") ? parseInt(formData.get("salary_max") as string) : undefined,
      description: formData.get("description"),
      requirements: formData.get("requirements"),
      benefits: formData.get("benefits"),
      job_type: formData.get("job_type"),
      experience_level: formData.get("experience_level"),
      visa_sponsorship: formData.get("visa_sponsorship") === "on",
      urgent: formData.get("urgent") === "on",
      industry: formData.get("industry"),
      skills: formData.get("skills") ? (formData.get("skills") as string).split(",").map(s => s.trim()) : [],
      application_deadline: formData.get("application_deadline"),
    });

    if (!validatedFields.success) {
      return {
        message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(", "),
        status: "error",
      };
    }

    const jobData = validatedFields.data;

    const { error } = await supabase
      .from("jobs")
      .update({
        ...jobData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", jobId)
      .eq("employer_id", user.id);

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to update job: ${error.message}`, status: "error" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/jobs");

    return { message: "Job updated successfully!", status: "success" };
  } catch (error) {
    console.error("updateJob error:", error);
    return { message: "Failed to update job", status: "error" };
  }
}

export async function deleteJob(jobId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Authentication required.", status: "error" };
    }

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .eq("employer_id", user.id);

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to delete job: ${error.message}`, status: "error" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/jobs");

    return { message: "Job deleted successfully!", status: "success" };
  } catch (error) {
    console.error("deleteJob error:", error);
    return { message: "Failed to delete job", status: "error" };
  }
}

export async function applyToJob(jobId: string, coverLetter: string, resumeFile?: File) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Authentication required.", status: "error" };
    }

    let resumePath = null;

    // Upload resume if provided
    if (resumeFile) {
      const filePath = `${user.id}/resumes/${Date.now()}-${resumeFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, resumeFile);

      if (uploadError) {
        console.error("Upload Error:", uploadError);
        return { message: `Failed to upload resume: ${uploadError.message}`, status: "error" };
      }

      resumePath = filePath;
    }

    // Create job application
    const { data: application, error } = await supabase
      .from("job_applications")
      .insert({
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter,
        resume_path: resumePath,
      })
      .select()
      .single();

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to submit application: ${error.message}`, status: "error" };
    }

    // Create conversation for this application
    if (application) {
      await supabase
        .from("conversations")
        .insert({
          job_application_id: application.id,
        });
    }

    revalidatePath("/dashboard");

    return { message: "Application submitted successfully!", status: "success" };
  } catch (error) {
    console.error("applyToJob error:", error);
    return { message: "Failed to submit application", status: "error" };
  }
}

export async function saveJob(jobId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Authentication required.", status: "error" };
    }

    const { error } = await supabase
      .from("saved_jobs")
      .insert({
        user_id: user.id,
        job_id: jobId,
      });

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to save job: ${error.message}`, status: "error" };
    }

    revalidatePath("/dashboard");

    return { message: "Job saved successfully!", status: "success" };
  } catch (error) {
    console.error("saveJob error:", error);
    return { message: "Failed to save job", status: "error" };
  }
}

export async function unsaveJob(jobId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { message: "Authentication required.", status: "error" };
    }

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("user_id", user.id)
      .eq("job_id", jobId);

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to unsave job: ${error.message}`, status: "error" };
    }

    revalidatePath("/dashboard");

    return { message: "Job removed from saved jobs!", status: "success" };
  } catch (error) {
    console.error("unsaveJob error:", error);
    return { message: "Failed to unsave job", status: "error" };
  }
}
