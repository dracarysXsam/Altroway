import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    console.error("Profile fetch error:", profileError);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <EditProfileForm profile={profile} />
      </div>
      <Footer />
    </div>
  );
}
