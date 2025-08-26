# 📁 Supabase Storage Setup Guide

## 🚨 Storage Bucket Error Fix

The error `"Bucket not found"` occurs because the required storage buckets haven't been created in Supabase.

## 🔧 Setup Steps

### Step 1: Create Storage Buckets in Supabase Dashboard

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/yswyapjqdtvydhvycfii
2. **Navigate to Storage**: Click on "Storage" in the left sidebar
3. **Create Buckets**: Create the following buckets:

#### Bucket 1: `documents`
- **Name**: `documents`
- **Public**: `false` (private bucket)
- **File size limit**: `50MB`
- **Allowed MIME types**: `application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*`

#### Bucket 2: `avatars` (optional)
- **Name**: `avatars`
- **Public**: `true` (public bucket for profile images)
- **File size limit**: `5MB`
- **Allowed MIME types**: `image/*`

### Step 2: Set Up Storage Policies

After creating the buckets, set up Row Level Security (RLS) policies:

#### For `documents` bucket:

```sql
-- Allow users to upload their own documents
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own documents
CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own documents
CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### For `avatars` bucket (if created):

```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Allow public access to avatars
CREATE POLICY "Public access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### Step 3: Test File Upload

After setting up the buckets and policies:

1. **Restart your development server**: `npm run dev`
2. **Test file upload**: Try uploading a document in the dashboard
3. **Verify in Supabase**: Check the Storage section to see uploaded files

## 📁 File Structure

The storage will organize files as follows:

```
documents/
├── {user_id}/
│   ├── resumes/
│   │   ├── {timestamp}-resume.pdf
│   │   └── {timestamp}-cv.docx
│   ├── certificates/
│   │   └── {timestamp}-certificate.pdf
│   └── other/
│       └── {timestamp}-document.pdf

avatars/
├── {user_id}/
│   └── {timestamp}-profile.jpg
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Bucket not found"**: Make sure the bucket name matches exactly (case-sensitive)
2. **"Permission denied"**: Check RLS policies are applied correctly
3. **"File too large"**: Adjust file size limits in bucket settings
4. **"Invalid file type"**: Check allowed MIME types in bucket settings

### Verification Queries:

```sql
-- Check if buckets exist
SELECT * FROM storage.buckets;

-- Check storage policies
SELECT * FROM storage.policies;

-- Check uploaded files
SELECT * FROM storage.objects WHERE bucket_id = 'documents';
```

## 🚀 Quick Setup Script

You can run this SQL in your Supabase SQL Editor to create everything at once:

```sql
-- Create documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*']);

-- Create avatars bucket (optional)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/*']);

-- Documents bucket policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatars bucket policies
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Public access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

---

After completing these steps, your file upload functionality should work correctly!
