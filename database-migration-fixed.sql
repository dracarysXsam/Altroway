-- =====================================================
-- FIXED DATABASE MIGRATION FOR ALTROWAY
-- This migration works with existing Supabase auth tables
-- =====================================================

-- Step 1: Create the user_role enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'legal_advisor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Alter the existing profiles table to add missing columns
-- (Only add columns that don't exist to avoid conflicts)

-- Add role column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN role user_role DEFAULT 'job_seeker';
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add profile_completion column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN profile_completion INTEGER DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add headline column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN headline TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add skills column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN skills TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add portfolio_url column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN portfolio_url TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Add avatar_url column if it doesn't exist
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Step 3: Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    job_type TEXT DEFAULT 'Full-time',
    experience_level TEXT DEFAULT 'Mid-level',
    visa_sponsorship BOOLEAN DEFAULT false,
    urgent BOOLEAN DEFAULT false,
    industry TEXT,
    skills TEXT[],
    application_deadline DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_path TEXT,
    status TEXT DEFAULT 'pending',
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, applicant_id)
);

-- Step 5: Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

-- Step 6: Create company_profiles table
CREATE TABLE IF NOT EXISTS company_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    company_name TEXT NOT NULL,
    industry TEXT,
    company_size TEXT,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    location TEXT,
    founded_year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create legal_services table
CREATE TABLE IF NOT EXISTS legal_services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    description TEXT,
    price_range TEXT,
    consultation_fee DECIMAL(10,2),
    languages TEXT[],
    specializations TEXT[],
    experience_years INTEGER,
    availability TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 8: Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 9: Create messaging tables for communication
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_visa_sponsorship ON jobs(visa_sponsorship);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

CREATE INDEX IF NOT EXISTS idx_conversations_job_application_id ON conversations(job_application_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Step 11: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 12: Create triggers for updated_at
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_profiles_updated_at BEFORE UPDATE ON company_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_legal_services_updated_at BEFORE UPDATE ON legal_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 13: Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 14: Create RLS policies (with IF NOT EXISTS checks)

-- Profiles policies
DO $$ BEGIN
    CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Jobs policies
DO $$ BEGIN
    CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can view their own jobs" ON jobs FOR SELECT USING (auth.uid() = employer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = employer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can delete their own jobs" ON jobs FOR DELETE USING (auth.uid() = employer_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Job applications policies
DO $$ BEGIN
    CREATE POLICY "Users can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can view applications for their jobs" ON job_applications FOR SELECT USING (
        EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create applications" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own applications" ON job_applications FOR UPDATE USING (auth.uid() = applicant_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Saved jobs policies
DO $$ BEGIN
    CREATE POLICY "Users can view their saved jobs" ON saved_jobs FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can save jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can unsave jobs" ON saved_jobs FOR DELETE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Company profiles policies
DO $$ BEGIN
    CREATE POLICY "Users can view company profiles" ON company_profiles FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can manage their own company profile" ON company_profiles FOR ALL USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Legal services policies
DO $$ BEGIN
    CREATE POLICY "Anyone can view legal services" ON legal_services FOR SELECT USING (true);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Legal advisors can manage their services" ON legal_services FOR ALL USING (auth.uid() = advisor_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Notifications policies
DO $$ BEGIN
    CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create conversations for their applications" ON conversations FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM job_applications ja 
            WHERE ja.id = conversations.job_application_id 
            AND (ja.applicant_id = auth.uid() OR 
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 15: Create trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, full_name, email, role)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, 'job_seeker');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 16: Insert sample job data (only if users exist)
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Check if there are any users in the auth.users table
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    -- Only insert sample jobs if a user exists
    IF sample_user_id IS NOT NULL THEN
        INSERT INTO jobs (employer_id, title, company, location, description, requirements, benefits, salary_min, salary_max, job_type, experience_level, visa_sponsorship, urgent, industry, skills) VALUES
        (
            sample_user_id,
            'Senior Software Engineer',
            'TechCorp GmbH',
            'Berlin, Germany',
            'We are looking for a Senior Software Engineer to join our growing team in Berlin. You will be responsible for developing and maintaining our core platform.',
            '5+ years of experience in software development, Strong knowledge of TypeScript/JavaScript, Experience with React and Node.js',
            'Competitive salary, Health insurance, Flexible working hours, Remote work options, Professional development budget',
            70000,
            90000,
            'Full-time',
            'Senior',
            true,
            false,
            'technology',
            ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS']
        ),
        (
            sample_user_id,
            'Marketing Manager',
            'Innovate Solutions',
            'Amsterdam, Netherlands',
            'Join our dynamic marketing team and help us grow our European presence. This role involves developing and executing marketing strategies.',
            '3+ years of marketing experience, Experience with digital marketing tools, Strong analytical skills',
            'Competitive salary, Performance bonuses, Health benefits, 25 days vacation',
            55000,
            75000,
            'Full-time',
            'Mid-level',
            true,
            true,
            'marketing',
            ARRAY['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media', 'Content Marketing']
        ),
        (
            sample_user_id,
            'Data Scientist',
            'DataFlow Analytics',
            'Paris, France',
            'We are seeking a Data Scientist to help us build predictive models and analyze large datasets to drive business decisions.',
            'Masters degree in Data Science or related field, Experience with Python, R, or similar, Knowledge of machine learning algorithms',
            'Competitive salary, Stock options, Health insurance, Flexible work arrangements',
            65000,
            85000,
            'Full-time',
            'Mid-level',
            true,
            false,
            'technology',
            ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'Statistics']
        );
        
        RAISE NOTICE 'Sample jobs created successfully with user ID: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No users found. Sample jobs will be created when the first user registers.';
    END IF;
END $$;

-- Step 17: Success message
SELECT 'Database migration completed successfully! All tables created and configured with messaging system.' as status;
