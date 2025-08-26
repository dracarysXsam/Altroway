-- SETUP SUPER ADMIN - Run this AFTER clean-database-setup.sql
-- Replace 'YOUR_EMAIL_HERE' with your actual email address

-- 1. First, let's see what users exist
SELECT 'Available users:' as info;
SELECT id, email FROM auth.users LIMIT 5;

-- 2. Update your profile to be a super admin (replace YOUR_EMAIL_HERE with your actual email)
UPDATE profiles 
SET role = 'super_admin', 
    full_name = 'System Administrator',
    is_active = true
WHERE email = 'YOUR_EMAIL_HERE';

-- 3. Verify the super admin was created
SELECT 'Super Admin Profile:' as info;
SELECT user_id, email, full_name, role, is_active 
FROM profiles 
WHERE role = 'super_admin';

-- 4. Create a test employer profile
INSERT INTO profiles (user_id, email, full_name, role) 
VALUES (
    gen_random_uuid(),
    'employer@test.com',
    'Test Employer',
    'employer'
) ON CONFLICT (user_id) DO UPDATE SET 
    role = 'employer',
    full_name = 'Test Employer';

-- 5. Create a test job seeker profile
INSERT INTO profiles (user_id, email, full_name, role, headline, skills) 
VALUES (
    gen_random_uuid(),
    'jobseeker@test.com',
    'Test Job Seeker',
    'job_seeker',
    'Passionate Developer',
    'React, TypeScript, JavaScript'
) ON CONFLICT (user_id) DO UPDATE SET 
    role = 'job_seeker',
    full_name = 'Test Job Seeker';

-- 6. Create a test job
INSERT INTO jobs (
    employer_id,
    title,
    company,
    location,
    description,
    requirements,
    benefits,
    job_type,
    experience_level,
    salary_min,
    salary_max,
    industry,
    skills,
    is_verified
) VALUES (
    (SELECT user_id FROM profiles WHERE email = 'employer@test.com' LIMIT 1),
    'Senior React Developer',
    'TechCorp GmbH',
    'Berlin, Germany',
    'We are looking for a talented React developer to join our team and help build amazing web applications.',
    '5+ years of React experience, TypeScript, Node.js, Git',
    'Competitive salary, flexible hours, remote work options, health insurance',
    'Full-time',
    'Senior',
    70000,
    90000,
    'Technology',
    'React, TypeScript, Node.js, Git, AWS',
    true
);

-- 7. Create a test job application
INSERT INTO job_applications (
    job_id,
    applicant_id,
    status,
    cover_letter
) VALUES (
    (SELECT id FROM jobs WHERE title = 'Senior React Developer' LIMIT 1),
    (SELECT user_id FROM profiles WHERE email = 'jobseeker@test.com' LIMIT 1),
    'pending',
    'I am excited to apply for this position. I have 6 years of experience with React and TypeScript, and I believe I would be a great fit for your team.'
);

-- 8. Create a conversation for the application
INSERT INTO conversations (job_application_id) VALUES (
    (SELECT id FROM job_applications WHERE status = 'pending' LIMIT 1)
);

-- 9. Create a test message
INSERT INTO messages (
    conversation_id,
    sender_id,
    content
) VALUES (
    (SELECT id FROM conversations LIMIT 1),
    (SELECT user_id FROM profiles WHERE email = 'jobseeker@test.com' LIMIT 1),
    'Thank you for considering my application. I would love to discuss this opportunity further.'
);

-- 10. Show final status
SELECT 'Super Admin Setup Complete!' as status;
SELECT 'You can now:' as info;
SELECT '- View all users, jobs, applications, and messages' as capability;
SELECT '- Manage site settings and system configuration' as capability;
SELECT '- Monitor all system activities through logs' as capability;
SELECT '- Control job verification and approval processes' as capability;
