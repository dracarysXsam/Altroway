-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the profiles table to store user-specific data
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create an applications table to store job applications for each user
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  applied_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create a documents table to store user document information
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  upload_date DATE NOT NULL,
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add a comment to inform about RLS policies
COMMENT ON TABLE profiles IS 'Stores public profile information for each user.';
COMMENT ON TABLE applications IS 'Stores job applications for each user.';
COMMENT ON TABLE documents IS 'Stores document metadata for each user.';

-- Note: Row Level Security (RLS) should be enabled on these tables
-- to ensure users can only access their own data.
-- Example for profiles:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users can view their own profile." ON profiles FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update their own profile." ON profiles FOR UPDATE USING (auth.uid() = user_id);
