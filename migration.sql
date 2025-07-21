
-- Create the saved_jobs table
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  job_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add a unique constraint to prevent duplicate saved jobs
ALTER TABLE saved_jobs ADD CONSTRAINT unique_user_job UNIQUE (user_id, job_id);
