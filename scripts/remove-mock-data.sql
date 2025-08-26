-- Remove all mock data and prepare for real user-generated data
-- This script cleans the database and sets up proper structure

-- Remove sample job data
DELETE FROM jobs WHERE employer_id = '00000000-0000-0000-0000-000000000001';

-- Remove any test profiles
DELETE FROM profiles WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Remove any test job applications
DELETE FROM job_applications WHERE applicant_id = '00000000-0000-0000-0000-000000000001';

-- Remove any test saved jobs
DELETE FROM saved_jobs WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Remove any test company profiles
DELETE FROM company_profiles WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Remove any test legal services
DELETE FROM legal_services WHERE advisor_id = '00000000-0000-0000-0000-000000000001';

-- Remove any test notifications
DELETE FROM notifications WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Reset sequences if they exist
-- Note: PostgreSQL doesn't have sequences for UUID primary keys, but this is for reference
-- ALTER SEQUENCE IF EXISTS jobs_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS profiles_id_seq RESTART WITH 1;

-- Verify clean state
SELECT 'jobs' as table_name, COUNT(*) as record_count FROM jobs
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'job_applications' as table_name, COUNT(*) as record_count FROM job_applications
UNION ALL
SELECT 'saved_jobs' as table_name, COUNT(*) as record_count FROM saved_jobs
UNION ALL
SELECT 'company_profiles' as table_name, COUNT(*) as record_count FROM company_profiles
UNION ALL
SELECT 'legal_services' as table_name, COUNT(*) as record_count FROM legal_services
UNION ALL
SELECT 'notifications' as table_name, COUNT(*) as record_count FROM notifications;
