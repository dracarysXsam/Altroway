-- Fix foreign key relationships
-- Migration: 08_fix_foreign_keys

-- Drop existing constraints if they exist
ALTER TABLE job_applications 
DROP CONSTRAINT IF EXISTS job_applications_applicant_id_fkey;

ALTER TABLE job_applications 
DROP CONSTRAINT IF EXISTS job_applications_job_id_fkey;

ALTER TABLE jobs 
DROP CONSTRAINT IF EXISTS jobs_employer_id_fkey;

ALTER TABLE conversations 
DROP CONSTRAINT IF EXISTS conversations_job_application_id_fkey;

ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;

ALTER TABLE messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

-- Add proper foreign key constraints
ALTER TABLE job_applications 
ADD CONSTRAINT job_applications_applicant_id_fkey 
FOREIGN KEY (applicant_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE job_applications 
ADD CONSTRAINT job_applications_job_id_fkey 
FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE;

ALTER TABLE jobs 
ADD CONSTRAINT jobs_employer_id_fkey 
FOREIGN KEY (employer_id) REFERENCES profiles(user_id) ON DELETE CASCADE;

ALTER TABLE conversations 
ADD CONSTRAINT conversations_job_application_id_fkey 
FOREIGN KEY (job_application_id) REFERENCES job_applications(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_conversation_id_fkey 
FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(user_id) ON DELETE CASCADE;
