-- SIMPLE TEST DATA - Run this AFTER step-by-step-database-fix.sql
-- This creates basic test data to verify everything works

-- 1. First, let's see what users exist
SELECT 'Available users:' as info;
SELECT id, email FROM auth.users LIMIT 5;

-- 2. Create a test profile for yourself (replace YOUR_USER_ID with your actual user ID)
-- You can find your user ID from the query above
INSERT INTO profiles (user_id, email, full_name, role) 
VALUES (
    'YOUR_USER_ID_HERE', -- Replace this with your actual user ID
    'test@example.com',
    'Test Employer',
    'employer'
) ON CONFLICT (user_id) DO UPDATE SET 
    role = 'employer',
    full_name = 'Test Employer';

-- 3. Create a test job
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
    skills
) VALUES (
    'YOUR_USER_ID_HERE', -- Replace this with your actual user ID
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
    'React, TypeScript, Node.js, Git, AWS'
);

-- 4. Create a fake applicant profile (this simulates someone applying)
INSERT INTO profiles (user_id, email, full_name, role, headline, skills) 
VALUES (
    gen_random_uuid(), -- Generate a fake UUID for demo
    'john.doe@example.com',
    'John Doe',
    'job_seeker',
    'Passionate Frontend Developer',
    'React, TypeScript, JavaScript, CSS, HTML'
);

-- 5. Create a job application (this simulates someone applying to your job)
INSERT INTO job_applications (
    job_id,
    applicant_id,
    status,
    cover_letter,
    applied_at
) VALUES (
    (SELECT id FROM jobs WHERE title = 'Senior React Developer' LIMIT 1),
    (SELECT user_id FROM profiles WHERE full_name = 'John Doe' LIMIT 1),
    'pending',
    'I am excited to apply for this position. I have 6 years of experience with React and TypeScript, and I believe I would be a great fit for your team.',
    NOW()
);

-- 6. Create a conversation for the application
INSERT INTO conversations (job_application_id) VALUES (
    (SELECT id FROM job_applications WHERE status = 'pending' LIMIT 1)
);

-- 7. Add a test message
INSERT INTO messages (
    conversation_id,
    sender_id,
    content
) VALUES (
    (SELECT id FROM conversations LIMIT 1),
    (SELECT user_id FROM profiles WHERE full_name = 'John Doe' LIMIT 1),
    'Thank you for considering my application. I would love to discuss this opportunity further.'
);

-- 8. Verify everything was created
SELECT 'Test data created successfully!' as status;

-- 9. Show what was created
SELECT 'Jobs created:' as info;
SELECT id, title, company, status FROM jobs;

SELECT 'Applications created:' as info;
SELECT 
    ja.id,
    ja.status,
    p.full_name as applicant_name,
    j.title as job_title
FROM job_applications ja
JOIN profiles p ON ja.applicant_id = p.user_id
JOIN jobs j ON ja.job_id = j.id;

SELECT 'Conversations created:' as info;
SELECT * FROM conversations;

SELECT 'Messages created:' as info;
SELECT * FROM messages;

-- 10. Test the foreign key relationships
SELECT 'Testing foreign key relationships:' as info;
SELECT 
    'profiles -> auth.users' as relationship,
    COUNT(*) as valid_profiles
FROM profiles p
JOIN auth.users u ON p.user_id = u.id;

SELECT 
    'jobs -> auth.users' as relationship,
    COUNT(*) as valid_jobs
FROM jobs j
JOIN auth.users u ON j.employer_id = u.id;

SELECT 
    'job_applications -> jobs' as relationship,
    COUNT(*) as valid_applications
FROM job_applications ja
JOIN jobs j ON ja.job_id = j.id;

SELECT 
    'job_applications -> profiles' as relationship,
    COUNT(*) as valid_applicant_profiles
FROM job_applications ja
JOIN profiles p ON ja.applicant_id = p.user_id;

SELECT 
    'conversations -> job_applications' as relationship,
    COUNT(*) as valid_conversations
FROM conversations c
JOIN job_applications ja ON c.job_application_id = ja.id;

SELECT 
    'messages -> conversations' as relationship,
    COUNT(*) as valid_messages
FROM messages m
JOIN conversations c ON m.conversation_id = c.id;

SELECT 
    'messages -> profiles' as relationship,
    COUNT(*) as valid_message_senders
FROM messages m
JOIN profiles p ON m.sender_id = p.user_id;
