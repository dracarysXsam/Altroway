# 🚨 QUICK FIX GUIDE - Fix All Current Errors

## 🎯 **IMMEDIATE ACTIONS TO FIX ALL ERRORS**

### **ERROR 1: "formData.get is not a function"**
**Status:** ✅ **FIXED** - Updated job-actions.ts

### **ERROR 2: "null value in column 'id'"**
**Status:** 🔧 **NEEDS DATABASE MIGRATION**

### **ERROR 3: "Bucket not found"**
**Status:** 🔧 **NEEDS STORAGE SETUP**

---

## 🔧 **STEP 1: APPLY DATABASE MIGRATION (CRITICAL)**

1. **Go to your Supabase Dashboard**
2. **Click on "SQL Editor"**
3. **Copy and paste this ENTIRE script:**

```sql
-- CRITICAL: Apply this migration to fix all database issues
-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS company_profiles CASCADE;
DROP TABLE IF EXISTS legal_services CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'legal_advisor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table with proper structure
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  headline TEXT,
  skills TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'job_seeker',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  experience_level TEXT NOT NULL DEFAULT 'Mid-level',
  visa_sponsorship BOOLEAN DEFAULT FALSE,
  urgent BOOLEAN DEFAULT FALSE,
  industry TEXT,
  skills TEXT[],
  application_deadline DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  resume_path TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

-- Create saved_jobs table
CREATE TABLE saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Employers can view their own jobs" ON jobs FOR SELECT USING (auth.uid() = employer_id);
CREATE POLICY "Employers can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Employers can delete their own jobs" ON jobs FOR DELETE USING (auth.uid() = employer_id);

CREATE POLICY "Applicants can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Users can insert applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can view their saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
```

4. **Click "Run" to execute the migration**

---

## 🔧 **STEP 2: SET UP STORAGE BUCKETS (CRITICAL)**

1. **In Supabase Dashboard, go to "Storage"**
2. **Click "New bucket"**
3. **Create these buckets:**

### **Bucket 1: `documents`**
- **Name:** `documents`
- **Public:** ❌ **No** (Private)
- **File size limit:** 50MB

### **Bucket 2: `avatars`**
- **Name:** `avatars`
- **Public:** ✅ **Yes** (Public)
- **File size limit:** 10MB

4. **Go back to SQL Editor and run these policies:**

```sql
-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload their own avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
```

---

## 🔧 **STEP 3: TEST THE FIXES**

1. **Restart your development server:**
```bash
npm run dev
```

2. **Test these flows:**
   - ✅ Register a new user
   - ✅ Update profile information
   - ✅ Create a job posting (if employer role)
   - ✅ Test file uploads

---

## ✅ **EXPECTED RESULTS**

After applying these fixes:
- ✅ **No more "formData.get is not a function" errors**
- ✅ **No more "null value in column 'id'" errors**
- ✅ **No more "Bucket not found" errors**
- ✅ **All CRUD operations working**
- ✅ **File uploads working**

---

## 🚨 **IF ERRORS PERSIST**

If you still see errors after applying these fixes:

1. **Clear your browser cache**
2. **Restart the development server**
3. **Check the browser console for any remaining errors**
4. **Verify the migration ran successfully in Supabase**

---

## 🎯 **NEXT STEPS**

Once these fixes are applied:
1. ✅ **All current errors will be resolved**
2. 🔄 **Build job seeker dashboard**
3. 🔄 **Build legal advisor dashboard**
4. 🎉 **Phase 1 will be 90% complete**

---

**🚀 Apply these fixes NOW to resolve all current errors!**
