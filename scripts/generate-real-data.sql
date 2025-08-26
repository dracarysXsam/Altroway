-- Generate realistic user data for testing
-- This script creates sample users and data that mimics real-world scenarios

-- Create sample users (these would normally be created through Supabase Auth)
-- For testing purposes, we'll create profiles directly

-- Sample Job Seekers
INSERT INTO profiles (user_id, full_name, headline, skills, portfolio_url, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Sarah Johnson', 'Senior Frontend Developer', 'React, TypeScript, Next.js, Tailwind CSS', 'https://sarahjohnson.dev', 'job_seeker'),
('22222222-2222-2222-2222-222222222222', 'Michael Chen', 'Full Stack Engineer', 'Node.js, React, PostgreSQL, AWS', 'https://michaelchen.tech', 'job_seeker'),
('33333333-3333-3333-3333-333333333333', 'Emma Rodriguez', 'UX/UI Designer', 'Figma, Adobe Creative Suite, User Research, Prototyping', 'https://emmarodriguez.design', 'job_seeker'),
('44444444-4444-4444-4444-444444444444', 'David Kim', 'DevOps Engineer', 'Docker, Kubernetes, AWS, Terraform, CI/CD', 'https://davidkim.dev', 'job_seeker'),
('55555555-5555-5555-5555-555555555555', 'Lisa Wang', 'Data Scientist', 'Python, Machine Learning, SQL, Statistics, TensorFlow', 'https://lisawang.ai', 'job_seeker');

-- Sample Employers
INSERT INTO profiles (user_id, full_name, headline, skills, portfolio_url, role) VALUES
('66666666-6666-6666-6666-666666666666', 'TechCorp GmbH', 'Leading Technology Company', 'Software Development, Innovation, Team Leadership', 'https://techcorp.de', 'employer'),
('77777777-7777-7777-7777-777777777777', 'Innovation Labs', 'Startup Studio', 'Product Development, Agile, Innovation', 'https://innovationlabs.eu', 'employer'),
('88888888-8888-8888-8888-888888888888', 'DataFlow Solutions', 'Data Analytics Company', 'Data Science, Analytics, Business Intelligence', 'https://dataflowsolutions.com', 'employer'),
('99999999-9999-9999-9999-999999999999', 'Design Studio Pro', 'Creative Agency', 'Design, Branding, User Experience', 'https://designstudiopro.com', 'employer'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CloudTech Systems', 'Cloud Infrastructure', 'DevOps, Cloud Computing, Infrastructure', 'https://cloudtechsystems.com', 'employer');

-- Sample Legal Advisors
INSERT INTO profiles (user_id, full_name, headline, skills, portfolio_url, role) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Dr. Anna Schmidt', 'Immigration Law Specialist', 'EU Immigration Law, Visa Applications, Legal Consultation', 'https://annaschmidt-law.de', 'legal_advisor'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Marcus Weber', 'Employment Law Expert', 'Labor Law, Contract Negotiation, Legal Compliance', 'https://marcusweber-law.com', 'legal_advisor'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Elena Popov', 'International Law Consultant', 'International Business Law, Cross-border Legal Issues', 'https://elenapopov-law.eu', 'legal_advisor');

-- Sample Jobs (created by employers)
INSERT INTO jobs (employer_id, title, company, location, salary_min, salary_max, description, requirements, benefits, job_type, experience_level, visa_sponsorship, urgent, industry, skills, application_deadline) VALUES
('66666666-6666-6666-6666-666666666666', 'Senior React Developer', 'TechCorp GmbH', 'Berlin, Germany', 70000, 90000, 'We are looking for a senior React developer to join our innovative team. You will be responsible for building scalable web applications and mentoring junior developers.', '5+ years React experience, TypeScript, Team leadership', 'Flexible hours, Remote work, Health insurance, Professional development', 'Full-time', 'Senior', true, true, 'Technology', ARRAY['React', 'TypeScript', 'Node.js', 'AWS'], '2024-12-31'),
('66666666-6666-6666-6666-666666666666', 'Frontend Developer', 'TechCorp GmbH', 'Munich, Germany', 50000, 70000, 'Join our fast-growing team as a frontend developer. You will work with modern technologies and have the opportunity to grow with the company.', '2+ years frontend experience, JavaScript, CSS', 'Competitive salary, Learning budget, Team events', 'Full-time', 'Mid-level', true, false, 'Technology', ARRAY['JavaScript', 'React', 'CSS', 'HTML'], '2024-11-30'),
('77777777-7777-7777-7777-777777777777', 'Product Manager', 'Innovation Labs', 'Amsterdam, Netherlands', 65000, 85000, 'Lead product strategy and development for our European expansion. You will work closely with engineering and design teams.', '3+ years product management, Agile, Analytics', 'Stock options, Flexible work, International team', 'Full-time', 'Senior', true, true, 'Technology', ARRAY['Product Strategy', 'Agile', 'Analytics', 'Leadership'], '2024-12-15'),
('88888888-8888-8888-8888-888888888888', 'Data Scientist', 'DataFlow Solutions', 'Paris, France', 60000, 80000, 'Analyze complex datasets to drive business insights and decisions. You will work on cutting-edge machine learning projects.', 'Masters in Data Science, Python, SQL', 'Research opportunities, Conference attendance, Flexible hours', 'Full-time', 'Mid-level', true, false, 'Data & Analytics', ARRAY['Python', 'Machine Learning', 'SQL', 'Statistics'], '2024-11-20'),
('99999999-9999-9999-9999-999999999999', 'UX Designer', 'Design Studio Pro', 'Barcelona, Spain', 45000, 60000, 'Create beautiful and intuitive user experiences for our digital products. You will work on projects for international clients.', '3+ years UX design, Figma, User research', 'Creative environment, International projects, Design conferences', 'Full-time', 'Mid-level', true, true, 'Design', ARRAY['Figma', 'User Research', 'Prototyping', 'Design Systems'], '2024-12-10'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'DevOps Engineer', 'CloudTech Systems', 'Stockholm, Sweden', 75000, 95000, 'Build and maintain scalable cloud infrastructure and deployment pipelines. You will work with cutting-edge cloud technologies.', '5+ years DevOps, Docker, Kubernetes', 'Remote work, Cloud certifications, Competitive salary', 'Full-time', 'Senior', true, false, 'Technology', ARRAY['Docker', 'Kubernetes', 'AWS', 'Terraform'], '2024-11-25');

-- Sample Company Profiles
INSERT INTO company_profiles (user_id, company_name, industry, size, description, website, location) VALUES
('66666666-6666-6666-6666-666666666666', 'TechCorp GmbH', 'Technology', '500-1000', 'Leading technology company specializing in software development and digital solutions.', 'https://techcorp.de', 'Berlin, Germany'),
('77777777-7777-7777-7777-777777777777', 'Innovation Labs', 'Technology', '50-200', 'Startup studio focused on innovative product development and digital transformation.', 'https://innovationlabs.eu', 'Amsterdam, Netherlands'),
('88888888-8888-8888-8888-888888888888', 'DataFlow Solutions', 'Data & Analytics', '100-500', 'Data analytics company providing business intelligence and machine learning solutions.', 'https://dataflowsolutions.com', 'Paris, France'),
('99999999-9999-9999-9999-999999999999', 'Design Studio Pro', 'Design', '20-100', 'Creative agency specializing in UX/UI design and brand development.', 'https://designstudiopro.com', 'Barcelona, Spain'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CloudTech Systems', 'Technology', '200-500', 'Cloud infrastructure company providing DevOps and infrastructure solutions.', 'https://cloudtechsystems.com', 'Stockholm, Sweden');

-- Sample Legal Services
INSERT INTO legal_services (advisor_id, service_name, description, price, duration_minutes, is_available) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'EU Blue Card Consultation', 'Comprehensive consultation for EU Blue Card applications including document review and application guidance.', 150.00, 60, true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Visa Application Review', 'Detailed review of visa applications with personalized recommendations and document checklist.', 100.00, 45, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Employment Contract Review', 'Legal review of employment contracts ensuring compliance with local labor laws.', 200.00, 90, true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Work Permit Assistance', 'Complete assistance with work permit applications and legal requirements.', 300.00, 120, true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'International Business Setup', 'Legal guidance for setting up international business operations in Europe.', 500.00, 180, true);

-- Sample Job Applications
INSERT INTO job_applications (job_id, applicant_id, cover_letter, status) VALUES
((SELECT id FROM jobs WHERE title = 'Senior React Developer' LIMIT 1), '11111111-1111-1111-1111-111111111111', 'I am excited to apply for the Senior React Developer position. With 5+ years of experience in React and TypeScript, I believe I would be a great fit for your team.', 'pending'),
((SELECT id FROM jobs WHERE title = 'Product Manager' LIMIT 1), '22222222-2222-2222-2222-222222222222', 'I am interested in the Product Manager role. My experience in agile methodologies and product strategy aligns well with your requirements.', 'pending'),
((SELECT id FROM jobs WHERE title = 'Data Scientist' LIMIT 1), '55555555-5555-5555-5555-555555555555', 'I am applying for the Data Scientist position. My background in machine learning and Python makes me an ideal candidate for this role.', 'pending');

-- Sample Saved Jobs
INSERT INTO saved_jobs (user_id, job_id) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM jobs WHERE title = 'Senior React Developer' LIMIT 1)),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM jobs WHERE title = 'Product Manager' LIMIT 1)),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM jobs WHERE title = 'UX Designer' LIMIT 1)),
('44444444-4444-4444-4444-444444444444', (SELECT id FROM jobs WHERE title = 'DevOps Engineer' LIMIT 1));

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
('11111111-1111-1111-1111-111111111111', 'Application Submitted', 'Your application for Senior React Developer has been submitted successfully.', 'success'),
('22222222-2222-2222-2222-222222222222', 'New Job Match', 'A new Product Manager position matches your profile.', 'info'),
('66666666-6666-6666-6666-666666666666', 'New Application', 'You have received a new application for Senior React Developer.', 'info'),
('77777777-7777-7777-7777-777777777777', 'Job Posted', 'Your Product Manager job posting is now live.', 'success');

-- Verify data generation
SELECT 'profiles' as table_name, COUNT(*) as record_count FROM profiles
UNION ALL
SELECT 'jobs' as table_name, COUNT(*) as record_count FROM jobs
UNION ALL
SELECT 'company_profiles' as table_name, COUNT(*) as record_count FROM company_profiles
UNION ALL
SELECT 'legal_services' as table_name, COUNT(*) as record_count FROM legal_services
UNION ALL
SELECT 'job_applications' as table_name, COUNT(*) as record_count FROM job_applications
UNION ALL
SELECT 'saved_jobs' as table_name, COUNT(*) as record_count FROM saved_jobs
UNION ALL
SELECT 'notifications' as table_name, COUNT(*) as record_count FROM notifications;
