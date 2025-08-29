-- Fix super admin role and add missing enum values
-- Migration: 07_fix_super_admin_role

-- First, ensure the super_admin role exists in the enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';

-- Update the most recent profile to be super admin
UPDATE profiles 
SET role = 'super_admin'::user_role,
    full_name = 'Super Administrator',
    is_active = true
WHERE user_id = (
    SELECT user_id FROM profiles 
    ORDER BY created_at DESC 
    LIMIT 1
);

-- Add test data for super admin to manage
INSERT INTO profiles (user_id, email, full_name, role, is_active) VALUES
(gen_random_uuid(), 'john.doe@example.com', 'John Doe', 'job_seeker'::user_role, true),
(gen_random_uuid(), 'jane.smith@example.com', 'Jane Smith', 'employer'::user_role, true),
(gen_random_uuid(), 'bob.wilson@example.com', 'Bob Wilson', 'legal_provider'::user_role, true)
ON CONFLICT (email) DO NOTHING;

-- Add test jobs
INSERT INTO jobs (id, title, company, location, description, salary_min, salary_max, status, is_verified, employer_id) VALUES
(gen_random_uuid(), 'Software Engineer', 'Tech Corp', 'Berlin', 'Full-stack developer needed', 50000, 80000, 'active'::job_status, false, (SELECT user_id FROM profiles WHERE email = 'jane.smith@example.com')),
(gen_random_uuid(), 'Legal Advisor', 'Law Firm', 'Paris', 'EU law specialist required', 60000, 90000, 'active'::job_status, false, (SELECT user_id FROM profiles WHERE email = 'bob.wilson@example.com'))
ON CONFLICT (id) DO NOTHING;

-- Add test applications
INSERT INTO job_applications (id, job_id, applicant_id, status, cover_letter) VALUES
(gen_random_uuid(), (SELECT id FROM jobs WHERE title = 'Software Engineer' LIMIT 1), (SELECT user_id FROM profiles WHERE email = 'john.doe@example.com'), 'pending'::application_status, 'I am interested in this position')
ON CONFLICT (id) DO NOTHING;

-- Add test conversations
INSERT INTO conversations (id, job_application_id, created_at) VALUES
(gen_random_uuid(), (SELECT id FROM job_applications LIMIT 1), NOW())
ON CONFLICT (id) DO NOTHING;

-- Add test messages
INSERT INTO messages (id, conversation_id, sender_id, content, created_at) VALUES
(gen_random_uuid(), (SELECT id FROM conversations LIMIT 1), (SELECT user_id FROM profiles WHERE email = 'john.doe@example.com'), 'Hello, I am interested in this position', NOW())
ON CONFLICT (id) DO NOTHING;

-- Add test system logs
INSERT INTO system_logs (id, user_id, action, table_name, record_id, details) VALUES
(gen_random_uuid(), (SELECT user_id FROM profiles WHERE email = 'shubhambhaskr123@gmail.com'), 'CREATE', 'profiles', 'test-user-1', 'Test user created')
ON CONFLICT (id) DO NOTHING;

-- Add test site settings
INSERT INTO site_settings (id, setting_key, setting_value, description, is_public) VALUES
(gen_random_uuid(), 'site_name', 'Altroway', 'Website name', true),
(gen_random_uuid(), 'maintenance_mode', 'false', 'Maintenance mode status', false),
(gen_random_uuid(), 'max_file_size', '10MB', 'Maximum file upload size', true)
ON CONFLICT (setting_key) DO NOTHING;
