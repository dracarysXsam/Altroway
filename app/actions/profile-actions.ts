"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  headline: z.string().min(5, { message: "Headline must be at least 5 characters." }),
  skills: z.string().optional(),
  portfolioUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Authentication required.", status: "error" };
  }

  const validatedFields = ProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    headline: formData.get("headline"),
    skills: formData.get("skills"),
    portfolioUrl: formData.get("portfolioUrl"),
  });

  if (!validatedFields.success) {
    return {
      message: Object.values(validatedFields.error.flatten().fieldErrors).flat().join(", "),
      status: "error",
    };
  }

  const { fullName, headline, skills, portfolioUrl } = validatedFields.data;

  try {
    // First, check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          headline: headline,
          skills: skills,
          portfolio_url: portfolioUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Database Error:", error);
        return { message: `Failed to update profile: ${error.message}`, status: "error" };
      }
    } else {
      // Create new profile
      const { error } = await supabase
        .from("profiles")
        .insert({
          user_id: user.id,
          full_name: fullName,
          headline: headline,
          skills: skills,
          portfolio_url: portfolioUrl,
        });

      if (error) {
        console.error("Database Error:", error);
        return { message: `Failed to create profile: ${error.message}`, status: "error" };
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile/edit");

    return { message: "Profile updated successfully!", status: "success" };
  } catch (e) {
    console.error("Unhandled Error:", e);
    return { message: "An unexpected error occurred.", status: "error" };
  }
}

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return profile;
}
