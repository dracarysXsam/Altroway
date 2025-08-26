CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'job_seeker' CHECK (role IN ('job_seeker', 'employer', 'legal_provider', 'super_admin')),
    headline TEXT,
    skills TEXT,
    avatar_url TEXT,
    portfolio_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all profiles" ON profiles FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can update all profiles" ON profiles FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can delete profiles" ON profiles FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    benefits TEXT,
    job_type TEXT DEFAULT 'Full-time',
    experience_level TEXT DEFAULT 'Mid-level',
    salary_min INTEGER,
    salary_max INTEGER,
    industry TEXT,
    skills TEXT,
    application_deadline DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed', 'suspended')),
    urgent BOOLEAN DEFAULT false,
    visa_sponsorship BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can view their own jobs" ON jobs FOR SELECT USING (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can create jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can delete their own jobs" ON jobs FOR DELETE USING (auth.uid() = employer_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all jobs" ON jobs FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can update all jobs" ON jobs FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can delete all jobs" ON jobs FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected')),
    cover_letter TEXT,
    resume_path TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Applicants can view their own applications" ON job_applications FOR SELECT USING (auth.uid() = applicant_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can view applications for their jobs" ON job_applications FOR SELECT USING (
        EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can apply to jobs" ON job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Employers can update application status" ON job_applications FOR UPDATE USING (
        EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all applications" ON job_applications FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can update all applications" ON job_applications FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can delete all applications" ON job_applications FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view conversations they're part of" ON conversations FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM job_applications ja
            WHERE ja.id = conversations.job_application_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can create conversations for their applications" ON conversations FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM job_applications ja
            WHERE ja.id = conversations.job_application_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all conversations" ON conversations FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_conversations_job_application_id ON conversations(job_application_id);

CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN job_applications ja ON ja.id = c.job_application_id
            WHERE c.id = messages.conversation_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can send messages in their conversations" ON messages FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM conversations c
            JOIN job_applications ja ON ja.id = c.job_application_id
            WHERE c.id = messages.conversation_id
            AND (ja.applicant_id = auth.uid() OR
                 EXISTS (SELECT 1 FROM jobs j WHERE j.id = ja.job_id AND j.employer_id = auth.uid()))
        )
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all messages" ON messages FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can delete all messages" ON messages FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

CREATE TABLE IF NOT EXISTS system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all system logs" ON system_logs FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "System can insert logs" ON system_logs FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Anyone can view public settings" ON site_settings FOR SELECT USING (is_public = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can view all settings" ON site_settings FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can update all settings" ON site_settings FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Super admins can insert settings" ON site_settings FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'super_admin')
    );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversations_updated_at ON conversations;
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'));
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION log_system_action()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO system_logs (user_id, action, table_name, record_id, old_values)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS log_profiles_changes ON profiles;
CREATE TRIGGER log_profiles_changes AFTER INSERT OR UPDATE OR DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION log_system_action();

DROP TRIGGER IF EXISTS log_jobs_changes ON jobs;
CREATE TRIGGER log_jobs_changes AFTER INSERT OR UPDATE OR DELETE ON jobs FOR EACH ROW EXECUTE FUNCTION log_system_action();

DROP TRIGGER IF EXISTS log_applications_changes ON job_applications;
CREATE TRIGGER log_applications_changes AFTER INSERT OR UPDATE OR DELETE ON job_applications FOR EACH ROW EXECUTE FUNCTION log_system_action();

INSERT INTO site_settings (setting_key, setting_value, description, is_public) VALUES
('site_name', 'Altroway', 'Website name', true),
('site_description', 'Professional job platform for international opportunities', 'Website description', true),
('maintenance_mode', 'false', 'Maintenance mode status', false),
('max_job_applications_per_user', '50', 'Maximum job applications per user', false),
('auto_approve_jobs', 'false', 'Automatically approve new job postings', false),
('require_job_verification', 'true', 'Require job verification before publishing', false)
ON CONFLICT (setting_key) DO NOTHING;

SELECT 'Database setup completed successfully with Super Admin system!' as status;
