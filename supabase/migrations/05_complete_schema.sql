-- Complete Database Schema for Altroway Platform
-- This migration adds all missing tables and fixes existing schema issues

-- 1. Create jobs table for job postings
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'EUR',
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  job_type TEXT NOT NULL DEFAULT 'Full-time', -- Full-time, Part-time, Contract, Internship
  experience_level TEXT DEFAULT 'Mid-level', -- Entry, Mid-level, Senior, Executive
  visa_sponsorship BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active', -- active, paused, closed, draft
  industry TEXT,
  skills TEXT[], -- Array of required skills
  application_deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create job applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reviewed, shortlisted, rejected, hired
  cover_letter TEXT,
  resume_path TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(job_id, applicant_id)
);

-- 3. Create saved jobs table (replacing the old one)
DROP TABLE IF EXISTS saved_jobs;
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);

-- 4. Add missing fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT now();

-- 5. Create company profiles table for employers
CREATE TABLE company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT, -- 1-10, 11-50, 51-200, 201-500, 500+
  website TEXT,
  description TEXT,
  logo_path TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Create legal services table for legal advisors
CREATE TABLE legal_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT NOT NULL,
  countries TEXT[] NOT NULL, -- Array of countries where service is available
  price_range TEXT,
  consultation_fee DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL, -- application, job, system, legal
  is_read BOOLEAN DEFAULT false,
  related_id UUID, -- ID of related entity (job_id, application_id, etc.)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Add indexes for better performance
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_visa_sponsorship ON jobs(visa_sponsorship);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- 9. Add comments for documentation
COMMENT ON TABLE jobs IS 'Job postings created by employers';
COMMENT ON TABLE job_applications IS 'Applications submitted by job seekers';
COMMENT ON TABLE saved_jobs IS 'Jobs saved by users for later viewing';
COMMENT ON TABLE company_profiles IS 'Company information for employers';
COMMENT ON TABLE legal_services IS 'Legal services offered by legal advisors';
COMMENT ON TABLE notifications IS 'User notifications for various events';

-- 10. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Add updated_at triggers
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Enable Row Level Security (RLS)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies
-- Jobs: Employers can manage their own jobs, everyone can view active jobs
CREATE POLICY "Employers can manage their own jobs" ON jobs FOR ALL USING (auth.uid() = employer_id);
CREATE POLICY "Everyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');

-- Job applications: Applicants can view their own applications, employers can view applications for their jobs
CREATE POLICY "Applicants can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Employers can view applications for their jobs" ON job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
);
CREATE POLICY "Applicants can create applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Saved jobs: Users can manage their own saved jobs
CREATE POLICY "Users can manage their own saved jobs" ON saved_jobs FOR ALL USING (auth.uid() = user_id);

-- Company profiles: Employers can manage their own company profile
CREATE POLICY "Employers can manage their own company profile" ON company_profiles FOR ALL USING (auth.uid() = employer_id);
CREATE POLICY "Everyone can view company profiles" ON company_profiles FOR SELECT USING (true);

-- Legal services: Legal advisors can manage their own services
CREATE POLICY "Legal advisors can manage their own services" ON legal_services FOR ALL USING (auth.uid() = advisor_id);
CREATE POLICY "Everyone can view legal services" ON legal_services FOR SELECT USING (is_available = true);

-- Notifications: Users can view their own notifications
CREATE POLICY "Users can view their own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
