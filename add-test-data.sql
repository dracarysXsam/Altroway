-- ADD TEST DATA - Run this AFTER the simple-database-fix.sql
-- This will create sample jobs and applications so you can see everything working

-- 1. First, let's see what users exist
SELECT id, email FROM auth.users LIMIT 5;

-- 2. Update your profile to be an employer (replace YOUR_USER_ID with your actual user ID)
-- You can find your user ID from the query above
UPDATE profiles 
SET role = 'employer', full_name = 'Test Employer'
WHERE user_id = 'YOUR_USER_ID_HERE'; -- Replace this with your actual user ID

-- 3. Create a test job (replace YOUR_USER_ID with your actual user ID)
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

-- 4. Create another test job
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
    'Frontend Developer',
    'StartupXYZ',
    'Munich, Germany',
    'Join our fast-growing startup and help shape the future of our product.',
    '3+ years of frontend development, JavaScript, CSS, responsive design',
    'Equity options, flexible work environment, learning budget',
    'Full-time',
    'Mid-level',
    55000,
    75000,
    'Technology',
    'JavaScript, React, CSS, HTML, Git'
);

-- 5. Create a test profile for a job seeker (this simulates someone applying)
INSERT INTO profiles (
    user_id,
    full_name,
    email,
    role,
    headline,
    skills
) VALUES (
    gen_random_uuid(), -- Generate a fake UUID for demo
    'John Doe',
    'john.doe@example.com',
    'job_seeker',
    'Passionate Frontend Developer',
    'React, TypeScript, JavaScript, CSS, HTML'
);

-- 6. Create a job application (this simulates someone applying to your job)
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

-- 7. Create another application
INSERT INTO job_applications (
    job_id,
    applicant_id,
    status,
    cover_letter,
    applied_at
) VALUES (
    (SELECT id FROM jobs WHERE title = 'Frontend Developer' LIMIT 1),
    (SELECT user_id FROM profiles WHERE full_name = 'John Doe' LIMIT 1),
    'pending',
    'I am very interested in this opportunity. I have been working with modern frontend technologies and would love to contribute to your startup.',
    NOW()
);

-- 8. Create a conversation for the first application
INSERT INTO conversations (job_application_id) VALUES (
    (SELECT id FROM job_applications WHERE status = 'pending' LIMIT 1)
);

-- 9. Add a test message
INSERT INTO messages (
    conversation_id,
    sender_id,
    content
) VALUES (
    (SELECT id FROM conversations LIMIT 1),
    (SELECT user_id FROM profiles WHERE full_name = 'John Doe' LIMIT 1),
    'Thank you for considering my application. I would love to discuss this opportunity further.'
);

-- 10. Verify everything was created
SELECT 'Test data created successfully!' as status;

-- 11. Show what was created
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
