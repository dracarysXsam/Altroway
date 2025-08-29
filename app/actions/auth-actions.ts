"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUserRole() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { role: null };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
      return { role: null };
    }

    return { role: profile?.role || "job_seeker" };
  } catch (error) {
    console.error("getUserRole error:", error);
    return { role: null };
  }
}

export async function updateUserRole(role: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication required" };
    }

    // Validate role
    const validRoles = ["job_seeker", "employer", "legal_advisor", "super_admin"];
    if (!validRoles.includes(role)) {
      return { error: "Invalid role" };
    }

    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating user role:", error);
      return { error: "Failed to update role" };
    }

    return { success: true };
  } catch (error) {
    console.error("updateUserRole error:", error);
    return { error: "Failed to update role" };
  }
}

export async function checkPermission(requiredRole: string) {
  try {
    const { role } = await getUserRole();
    
    if (!role) {
      return { hasPermission: false };
    }

    // Define role hierarchy
    const roleHierarchy = {
      "job_seeker": 1,
      "employer": 2,
      "legal_advisor": 3,
      "super_admin": 4
    };

    const userLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return { hasPermission: userLevel >= requiredLevel };
  } catch (error) {
    console.error("checkPermission error:", error);
    return { hasPermission: false };
  }
}
