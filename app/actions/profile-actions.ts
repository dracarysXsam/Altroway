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
  const supabase = createClient();

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
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: fullName,
          headline: headline,
          skills: skills,
          portfolio_url: portfolioUrl,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("Database Error:", error);
      return { message: `Failed to update profile: ${error.message}`, status: "error" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/profile/edit");

    return { message: "Profile updated successfully!", status: "success" };
  } catch (e) {
    console.error("Unhandled Error:", e);
    return { message: "An unexpected error occurred.", status: "error" };
  }
}
