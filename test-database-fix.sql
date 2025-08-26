-- Test script to verify database fix
-- Run this after applying the emergency fix

-- Test 1: Check if tables exist
SELECT 'Tables Check' as test_name;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'jobs', 'job_applications', 'saved_jobs', 'company_profiles', 'legal_services', 'notifications')
ORDER BY table_name;

-- Test 2: Check profiles table structure
SELECT 'Profiles Structure Check' as test_name;
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Test 3: Check if we can insert a test profile
SELECT 'Profile Insert Test' as test_name;
INSERT INTO profiles (user_id, full_name, headline, role) 
VALUES ('test-user-123', 'Test User', 'Test Headline', 'job_seeker')
ON CONFLICT (user_id) DO NOTHING;

-- Test 4: Check if we can insert a test job
SELECT 'Job Insert Test' as test_name;
INSERT INTO jobs (employer_id, title, company, location, description) 
VALUES ('test-employer-123', 'Test Job', 'Test Company', 'Test Location', 'This is a test job description for testing purposes.')
ON CONFLICT DO NOTHING;

-- Test 5: Verify data was inserted
SELECT 'Data Verification' as test_name;
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'jobs' as table_name, COUNT(*) as record_count FROM jobs;

-- Test 6: Clean up test data
SELECT 'Cleanup Test Data' as test_name;
DELETE FROM jobs WHERE employer_id = 'test-employer-123';
DELETE FROM profiles WHERE user_id = 'test-user-123';

-- Test 7: Final verification
SELECT 'Final Verification' as test_name;
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'jobs' as table_name, COUNT(*) as record_count FROM jobs
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

-- If all tests pass, you should see:
-- 1. All 7 tables listed in the first test
-- 2. Profiles table with proper id column (UUID, NOT NULL, DEFAULT gen_random_uuid())
-- 3. Successful insert operations
-- 4. Record counts (should be 0 after cleanup)
-- 5. No error messages
