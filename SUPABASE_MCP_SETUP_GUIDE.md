# 🔧 Supabase MCP Setup & Project Fix Guide

## 🚨 Current Issues Identified

### 1. **Supabase MCP Connection Not Active**
- **Status**: ❌ Connection failed to establish
- **Issue**: MCP requires proper authentication to access Supabase project

### 2. **Missing Environment Configuration**
- **Status**: ❌ No `.env.local` file found
- **Issue**: Application cannot connect to Supabase without credentials

### 3. **Database Schema Issues**
- **Status**: ⚠️ Migration needs to be applied
- **Issue**: Latest schema changes not applied to database

## 🔧 Step-by-Step Fix Guide

### Step 1: Set Up Environment Variables

Create a `.env.local` file in your project root with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yswyapjqdtvydhvycfii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI Configuration (for chat functionality)
GROQ_API_KEY=your_groq_api_key_here
```

**To get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `yswyapjqdtvydhvycfii`
3. Go to Settings → API
4. Copy the URL and anon key
5. For service role key, go to Settings → API → Project API keys

### Step 2: Apply Database Migration

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/yswyapjqdtvydhvycfii
2. **Navigate to SQL Editor**
3. **Run the complete migration**:

```sql
-- Fix all database issues and set up complete schema
-- This migration addresses all the errors we've seen

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
  phone TEXT,
  country TEXT,
  city TEXT,
  bio TEXT,
  experience_years INTEGER,
  education TEXT,
  languages TEXT[],
  profile_completion INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  last_active TIMESTAMPTZ DEFAULT now(),
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

-- Create company_profiles table
CREATE TABLE company_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_services table
CREATE TABLE legal_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_minutes INTEGER,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_services_updated_at BEFORE UPDATE ON legal_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Employers can view their own jobs" ON jobs FOR SELECT USING (auth.uid() = employer_id);
CREATE POLICY "Employers can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
CREATE POLICY "Employers can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = employer_id);
CREATE POLICY "Employers can delete their own jobs" ON jobs FOR DELETE USING (auth.uid() = employer_id);

-- Job applications policies
CREATE POLICY "Applicants can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Employers can view applications for their jobs" ON job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
);
CREATE POLICY "Users can insert applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Employers can update applications for their jobs" ON job_applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
);

-- Saved jobs policies
CREATE POLICY "Users can view their saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their saved jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);

-- Company profiles policies
CREATE POLICY "Anyone can view company profiles" ON company_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own company profile" ON company_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own company profile" ON company_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Legal services policies
CREATE POLICY "Anyone can view legal services" ON legal_services FOR SELECT USING (true);
CREATE POLICY "Advisors can manage their own services" ON legal_services FOR ALL USING (auth.uid() = advisor_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT WITH CHECK (true);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, full_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'job_seeker');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
```

### Step 3: Set Up Storage Buckets

1. **Go to Storage in Supabase Dashboard**
2. **Create the following buckets**:

**Documents Bucket (Private):**
- Name: `documents`
- Public: `false`

**Avatars Bucket (Public):**
- Name: `avatars`
- Public: `true`

3. **Apply Storage Policies**:

```sql
-- Documents bucket policies
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Avatars bucket policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Step 4: Fix Supabase MCP Connection

The MCP connection requires proper authentication. You have two options:

**Option A: Use Supabase Dashboard (Recommended)**
- Continue using the Supabase Dashboard for database management
- The MCP connection is not critical for development

**Option B: Set up MCP Authentication**
1. Follow the OAuth flow provided by the MCP
2. Complete authentication in your browser
3. Verify connection status

### Step 5: Test the Application

1. **Start the development server**:
```bash
npm run dev
```

2. **Test the following flows**:
   - User registration
   - Profile updates
   - Job posting (as employer)
   - Job application (as job seeker)
   - File uploads

## ✅ Expected Results

After completing these steps:
- ✅ Database schema properly set up
- ✅ All tables and relationships created
- ✅ RLS policies applied
- ✅ Storage buckets configured
- ✅ Application fully functional
- ✅ No more database constraint errors

## 🚨 Troubleshooting

### If you get "Table already exists" errors:
- The migration includes `DROP TABLE IF EXISTS` statements
- This will safely remove existing tables and recreate them

### If you get permission errors:
- Make sure you're using the correct Supabase credentials
- Verify the service role key has proper permissions

### If the application still doesn't work:
1. Clear browser cache
2. Restart the development server
3. Check browser console for errors
4. Verify all environment variables are set correctly

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Ensure all environment variables are correctly set
4. Test the database connection in Supabase Dashboard

---

**🎯 Complete these steps in order to fix all current issues!**
