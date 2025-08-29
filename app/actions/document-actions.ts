"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

const UploadSchema = z.object({
  document: z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required.")
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      ".pdf, .jpg, .png, and .webp files are accepted."
    ),
});

export async function uploadDocument(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { message: "Authentication required.", status: "error" };
  }

  const validatedFields = UploadSchema.safeParse({
    document: formData.get("document"),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.document?.join(", ") ?? "Invalid file.",
      status: "error",
    };
  }

  const { document: file } = validatedFields.data;

  try {
    // 1. Upload file to Supabase Storage
    const filePath = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, file);

    if (uploadError) {
      console.error("Storage Error:", uploadError);
      return { message: `Failed to upload file: ${uploadError.message}`, status: "error" };
    }

    // 2. Insert record into the documents table
    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      name: file.name,
      type: file.type,
      status: "Uploaded",
      upload_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      storage_path: filePath,
    });

    if (dbError) {
      console.error("Database Error:", dbError);
      // Attempt to delete the file from storage if DB insert fails to maintain consistency
      await supabase.storage.from("documents").remove([filePath]);
      return { message: `Failed to save document record: ${dbError.message}`, status: "error" };
    }

    // 3. Revalidate the dashboard path
    revalidatePath("/dashboard");

    return { message: "Document uploaded successfully!", status: "success" };
  } catch (e) {
    console.error("Unhandled Error:", e);
    return { message: "An unexpected error occurred.", status: "error" };
  }
}
