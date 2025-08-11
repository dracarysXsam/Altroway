-- Define a user_role type to ensure data consistency
CREATE TYPE user_role AS ENUM ('job_seeker', 'employer', 'legal_advisor');

-- Add the new role column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN role user_role NOT NULL DEFAULT 'job_seeker';

-- Add a comment to describe the new column
COMMENT ON COLUMN public.profiles.role IS 'The role of the user within the platform.';
