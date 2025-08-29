-- Add CRM and Analytics Features
-- Migration: 09_crm_analytics_features

-- Add CRM-related columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS company VARCHAR(255),
ADD COLUMN IF NOT EXISTS position VARCHAR(255),
ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS lead_status VARCHAR(50) DEFAULT 'new',
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add CRM-related columns to jobs
ALTER TABLE jobs 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS budget_range VARCHAR(50),
ADD COLUMN IF NOT EXISTS urgency_level VARCHAR(20) DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS hiring_manager VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);

-- Add CRM-related columns to job_applications
ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'website',
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS interview_scheduled TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS interview_notes TEXT,
ADD COLUMN IF NOT EXISTS recruiter_notes TEXT,
ADD COLUMN IF NOT EXISTS next_action VARCHAR(100),
ADD COLUMN IF NOT EXISTS next_action_date TIMESTAMP WITH TIME ZONE;

-- Create leads table for CRM
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(255),
    position VARCHAR(255),
    industry VARCHAR(100),
    lead_source VARCHAR(50) DEFAULT 'website',
    lead_status VARCHAR(50) DEFAULT 'new',
    lead_score INTEGER DEFAULT 0,
    notes TEXT,
    assigned_to UUID REFERENCES profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact TIMESTAMP WITH TIME ZONE,
    next_follow_up TIMESTAMP WITH TIME ZONE
);

-- Create interactions table for CRM
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(user_id),
    interaction_type VARCHAR(50) NOT NULL,
    subject VARCHAR(255),
    content TEXT,
    channel VARCHAR(50),
    duration INTEGER,
    outcome VARCHAR(100),
    next_action VARCHAR(100),
    next_action_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaigns table for CRM
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'draft',
    target_audience TEXT,
    message_template TEXT,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    sent_date TIMESTAMP WITH TIME ZONE,
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_clicked INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create campaign_recipients table
CREATE TABLE IF NOT EXISTS campaign_recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES profiles(user_id),
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    converted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(user_id),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    page_url VARCHAR(500),
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create revenue_tracking table
CREATE TABLE IF NOT EXISTS revenue_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(user_id),
    revenue_type VARCHAR(50),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    transaction_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_lead_status ON profiles(lead_status);
CREATE INDEX IF NOT EXISTS idx_profiles_lead_score ON profiles(lead_score);
CREATE INDEX IF NOT EXISTS idx_jobs_views ON jobs(views);
CREATE INDEX IF NOT EXISTS idx_jobs_applications_count ON jobs(applications_count);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score);
CREATE INDEX IF NOT EXISTS idx_interactions_lead_id ON interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);

-- Add RLS policies for new tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for leads
DO $$ BEGIN
    CREATE POLICY "Super admins can manage all leads" ON leads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS policies for interactions
DO $$ BEGIN
    CREATE POLICY "Super admins can manage all interactions" ON interactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS policies for campaigns
DO $$ BEGIN
    CREATE POLICY "Super admins can manage all campaigns" ON campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS policies for campaign_recipients
DO $$ BEGIN
    CREATE POLICY "Super admins can manage all campaign recipients" ON campaign_recipients
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS policies for analytics_events
DO $$ BEGIN
    CREATE POLICY "Super admins can view all analytics events" ON analytics_events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- RLS policies for revenue_tracking
DO $$ BEGIN
    CREATE POLICY "Super admins can manage all revenue data" ON revenue_tracking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.user_id = auth.uid() 
            AND profiles.role = 'super_admin'
        )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample CRM data
INSERT INTO leads (email, full_name, phone, company, position, industry, lead_source, lead_status, lead_score) VALUES
('john.smith@techcorp.com', 'John Smith', '+1-555-0101', 'Tech Corp', 'CTO', 'Technology', 'website', 'qualified', 85),
('sarah.jones@legalgroup.com', 'Sarah Jones', '+1-555-0102', 'Legal Group', 'Partner', 'Legal Services', 'referral', 'contacted', 70),
('mike.wilson@startup.com', 'Mike Wilson', '+1-555-0103', 'Startup Inc', 'CEO', 'Technology', 'cold_call', 'new', 45)
ON CONFLICT (email) DO NOTHING;

INSERT INTO campaigns (name, description, campaign_type, status, target_audience, message_template) VALUES
('Q1 Job Seeker Outreach', 'Targeted campaign for active job seekers', 'email', 'active', 'Job seekers in tech industry', 'Hello {{name}}, we have exciting opportunities for you!'),
('Employer Recruitment Drive', 'Campaign to attract new employers', 'email', 'draft', 'HR professionals and hiring managers', 'Join our platform to find top talent!')
ON CONFLICT (id) DO NOTHING;

-- Update existing profiles with CRM data
UPDATE profiles 
SET phone = '+1-555-0001',
    company = 'Altroway',
    position = 'Super Administrator',
    industry = 'Technology',
    profile_completion = 100,
    lead_score = 100,
    lead_status = 'customer'
WHERE role = 'super_admin';

-- Add sample analytics events
INSERT INTO analytics_events (user_id, event_type, event_data, page_url) VALUES
((SELECT user_id FROM profiles WHERE role = 'super_admin' LIMIT 1), 'page_view', '{"page": "dashboard"}', '/dashboard'),
((SELECT user_id FROM profiles WHERE role = 'super_admin' LIMIT 1), 'feature_used', '{"feature": "crm_dashboard"}', '/dashboard')
ON CONFLICT (id) DO NOTHING;

