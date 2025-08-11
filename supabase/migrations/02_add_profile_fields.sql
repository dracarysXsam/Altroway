-- Add new fields to the profiles table to store more user information.
ALTER TABLE public.profiles
ADD COLUMN headline TEXT,
ADD COLUMN skills TEXT, -- Could be a comma-separated list or a JSONB array
ADD COLUMN portfolio_url TEXT;

-- Add a comment to describe the new columns.
COMMENT ON COLUMN public.profiles.headline IS 'A short, professional headline for the user.';
COMMENT ON COLUMN public.profiles.skills IS 'A list of the user''s skills.';
COMMENT ON COLUMN public.profiles.portfolio_url IS 'A URL to the user''s online portfolio.';
