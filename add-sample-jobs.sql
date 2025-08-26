-- =====================================================
-- ADD SAMPLE JOBS SCRIPT
-- Run this after users have registered to add sample job data
-- =====================================================

-- Insert sample job data with the first available user as employer
DO $$
DECLARE
    sample_user_id UUID;
BEGIN
    -- Get the first user from auth.users table
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    IF sample_user_id IS NOT NULL THEN
        -- Insert sample jobs
        INSERT INTO jobs (employer_id, title, company, location, description, requirements, benefits, salary_min, salary_max, job_type, experience_level, visa_sponsorship, urgent, industry, skills) VALUES
        (
            sample_user_id,
            'Senior Software Engineer',
            'TechCorp GmbH',
            'Berlin, Germany',
            'We are looking for a Senior Software Engineer to join our growing team in Berlin. You will be responsible for developing and maintaining our core platform.',
            '5+ years of experience in software development, Strong knowledge of TypeScript/JavaScript, Experience with React and Node.js',
            'Competitive salary, Health insurance, Flexible working hours, Remote work options, Professional development budget',
            70000,
            90000,
            'Full-time',
            'Senior',
            true,
            false,
            'technology',
            ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS']
        ),
        (
            sample_user_id,
            'Marketing Manager',
            'Innovate Solutions',
            'Amsterdam, Netherlands',
            'Join our dynamic marketing team and help us grow our European presence. This role involves developing and executing marketing strategies.',
            '3+ years of marketing experience, Experience with digital marketing tools, Strong analytical skills',
            'Competitive salary, Performance bonuses, Health benefits, 25 days vacation',
            55000,
            75000,
            'Full-time',
            'Mid-level',
            true,
            true,
            'marketing',
            ARRAY['Digital Marketing', 'SEO', 'Google Analytics', 'Social Media', 'Content Marketing']
        ),
        (
            sample_user_id,
            'Data Scientist',
            'DataFlow Analytics',
            'Paris, France',
            'We are seeking a Data Scientist to help us build predictive models and analyze large datasets to drive business decisions.',
            'Masters degree in Data Science or related field, Experience with Python, R, or similar, Knowledge of machine learning algorithms',
            'Competitive salary, Stock options, Health insurance, Flexible work arrangements',
            65000,
            85000,
            'Full-time',
            'Mid-level',
            true,
            false,
            'technology',
            ARRAY['Python', 'R', 'Machine Learning', 'SQL', 'Statistics']
        ),
        (
            sample_user_id,
            'UX/UI Designer',
            'Creative Studios',
            'Barcelona, Spain',
            'Join our creative team and help design beautiful, user-friendly interfaces for our products.',
            '3+ years of UX/UI design experience, Proficiency in Figma, Adobe Creative Suite, Strong portfolio',
            'Competitive salary, Creative freedom, Flexible hours, Remote work options, Conference budget',
            45000,
            65000,
            'Full-time',
            'Mid-level',
            true,
            false,
            'design',
            ARRAY['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems']
        ),
        (
            sample_user_id,
            'Product Manager',
            'Innovation Labs',
            'Stockholm, Sweden',
            'Lead product development from concept to launch. Work with cross-functional teams to deliver exceptional user experiences.',
            '5+ years of product management experience, Strong analytical skills, Experience with Agile methodologies',
            'Competitive salary, Stock options, Health benefits, Professional development, Flexible work',
            75000,
            95000,
            'Full-time',
            'Senior',
            true,
            false,
            'technology',
            ARRAY['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Stakeholder Management']
        );
        
        RAISE NOTICE 'Sample jobs created successfully with user ID: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please register a user first, then run this script again.';
    END IF;
END $$;

-- Success message
SELECT 'Sample jobs added successfully!' as status;
