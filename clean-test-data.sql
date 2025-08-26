SELECT id, email FROM auth.users LIMIT 5;

INSERT INTO profiles (user_id, email, full_name, role) 
VALUES (
    'YOUR_USER_ID_HERE',
    'test@example.com',
    'Test Employer',
    'employer'
) ON CONFLICT (user_id) DO UPDATE SET 
    role = 'employer',
    full_name = 'Test Employer';

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
    'YOUR_USER_ID_HERE',
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

INSERT INTO profiles (user_id, email, full_name, role, headline, skills) 
VALUES (
    gen_random_uuid(),
    'john.doe@example.com',
    'John Doe',
    'job_seeker',
    'Passionate Frontend Developer',
    'React, TypeScript, JavaScript, CSS, HTML'
);

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

INSERT INTO conversations (job_application_id) VALUES (
    (SELECT id FROM job_applications WHERE status = 'pending' LIMIT 1)
);

INSERT INTO messages (
    conversation_id,
    sender_id,
    content
) VALUES (
    (SELECT id FROM conversations LIMIT 1),
    (SELECT user_id FROM profiles WHERE full_name = 'John Doe' LIMIT 1),
    'Thank you for considering my application. I would love to discuss this opportunity further.'
);

SELECT 'Test data created successfully!' as status;
