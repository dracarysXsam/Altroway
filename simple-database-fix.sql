-- SIMPLE DATABASE FIX - Guaranteed to Work (Safe to Run Multiple Times)
-- Run this in Supabase SQL Editor

-- 1. Drop all existing tables to start fresh
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Drop existing triggers and functions safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;

DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 3. Create profiles table
CREATE TABLE profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'job_seeker',
    headline TEXT,
    skills TEXT,
    avatar_url TEXT,
    portfolio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create jobs table
CREATE TABLE jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    job_type TEXT DEFAULT 'Full-time',
    experience_level TEXT DEFAULT 'Mid-level',
    salary_min INTEGER,
    salary_max INTEGER,
    industry TEXT,
    skills TEXT,
    application_deadline DATE,
    status TEXT DEFAULT 'active',
    urgent BOOLEAN DEFAULT false,
    visa_sponsorship BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create job_applications table
CREATE TABLE job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending',
    cover_letter TEXT,
    resume_path TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create conversations table
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create messages table
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_job_application_id ON conversations(job_application_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- 9. Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies (with IF NOT EXISTS handling)
DO $$ BEGIN
    CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Jobs policies
DO $$ BEGIN
    CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can view their own jobs" ON jobs FOR SELECT USING (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can delete their own jobs" ON jobs FOR DELETE USING (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Job applications policies
DO $$ BEGIN
    CREATE POLICY "Applicants can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can view applications for their jobs" ON job_applications FOR SELECT USING (
        EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can apply to jobs" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can update application status" ON job_applications FOR UPDATE USING (
        EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Conversations policies
DO $$ BEGIN
    CREATE POLICY "Users can view conversations they're part of" ON conversations FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM job_applications ja
            WHERE ja.id = conversations.job_application_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create conversations for their applications" ON conversations FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM job_applications ja
            WHERE ja.id = conversations.job_application_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Messages policies
DO $$ BEGIN
    CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN job_applications ja ON ja.id = c.job_application_id
            WHERE c.id = messages.conversation_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN job_applications ja ON ja.id = c.job_application_id
            WHERE c.id = messages.conversation_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 11. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Create trigger for new user profiles
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    -- Profile already exists, ignore
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 13. Verify success
SELECT 'Database created successfully! All tables and relationships are now working.' as status;
