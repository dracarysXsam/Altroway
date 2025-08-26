-- Fix Database Schema - Missing Foreign Keys and Relationships
-- Run this in Supabase SQL Editor

-- 1. First, let's check what tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'jobs', 'job_applications', 'conversations', 'messages');

-- 2. Check existing foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name IN ('profiles', 'jobs', 'job_applications', 'conversations', 'messages');

-- 3. Fix the profiles table if it's missing columns
DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'job_seeker';
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS headline TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 4. Create proper foreign key relationships
-- First, drop any existing incorrect constraints
DO $$ BEGIN
    ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_applicant_id_fkey;
EXCEPTION WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE job_applications DROP CONSTRAINT IF EXISTS job_applications_job_id_fkey;
EXCEPTION WHEN undefined_object THEN null; END $$;

-- Now create the correct foreign key relationships
ALTER TABLE job_applications 
ADD CONSTRAINT job_applications_applicant_id_fkey 
FOREIGN KEY (applicant_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE job_applications 
ADD CONSTRAINT job_applications_job_id_fkey 
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

-- 5. Ensure the jobs table has the employer_id foreign key
DO $$ BEGIN
    ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_employer_id_fkey;
EXCEPTION WHEN undefined_object THEN null; END $$;

ALTER TABLE jobs 
ADD CONSTRAINT jobs_employer_id_fkey 
FOREIGN KEY (employer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Fix the conversations table
DO $$ BEGIN
    ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_job_application_id_fkey;
EXCEPTION WHEN undefined_object THEN null; END $$;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_job_application_id_fkey 
FOREIGN KEY (job_application_id) REFERENCES job_applications(id) ON DELETE CASCADE;

-- 7. Fix the messages table
DO $$ BEGIN
    ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;
EXCEPTION WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
EXCEPTION WHEN undefined_object THEN null; END $$;

ALTER TABLE messages 
ADD CONSTRAINT messages_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 8. Add missing columns to job_applications if they don't exist
DO $$ BEGIN
    ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS cover_letter TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS resume_path TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 9. Add missing columns to jobs if they don't exist
DO $$ BEGIN
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_job_application_id ON conversations(job_application_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- 11. Verify the structure
SELECT 'Database schema fixed successfully!' as status;
