# 🔄 Altroway System Data Flow & Architecture

## 📊 Complete Data Flow Overview

### 1. User Authentication Flow
```
User Registration/Login → Supabase Auth → Profile Creation → Role Assignment → Dashboard Access
```

**Detailed Steps:**
1. **Registration**: User fills registration form
2. **Email Verification**: Supabase sends verification email
3. **Profile Creation**: Trigger creates profile record with role
4. **Dashboard Redirect**: User redirected to role-specific dashboard

### 2. Job Posting Flow (Employer)
```
Employer Dashboard → Create Job Form → Server Action → Database Insert → RLS Policy → Job Visibility
```

**Detailed Steps:**
1. **Form Submission**: Employer fills job creation form
2. **Validation**: Server action validates form data
3. **Database Insert**: Job inserted into `jobs` table
4. **RLS Policy**: Row Level Security ensures proper access
5. **UI Update**: Dashboard refreshes to show new job

**Data Storage:**
- **Table**: `jobs`
- **Key Fields**: `employer_id`, `title`, `company`, `location`, `salary_min/max`, `description`, `requirements`, `benefits`, `job_type`, `experience_level`, `visa_sponsorship`, `urgent`, `status`, `industry`, `skills[]`, `application_deadline`
- **Relationships**: Links to `auth.users` via `employer_id`

### 3. Job Application Flow (Job Seeker)
```
Job Browse → Apply Form → Resume Upload → Server Action → Application Creation → Notification
```

**Detailed Steps:**
1. **Job Discovery**: Job seeker browses available jobs
2. **Application Form**: Fills application with cover letter
3. **Resume Upload**: File uploaded to Supabase Storage
4. **Database Insert**: Application created in `job_applications` table
5. **Notification**: Employer notified of new application

**Data Storage:**
- **Table**: `job_applications`
- **Key Fields**: `job_id`, `applicant_id`, `status`, `cover_letter`, `resume_path`, `applied_at`
- **Storage**: Resume files stored in Supabase Storage
- **Relationships**: Links to `jobs` and `auth.users`

### 4. Profile Management Flow
```
Profile Edit → Form Submission → Server Action → Database Update → Dashboard Refresh
```

**Detailed Steps:**
1. **Profile Access**: User accesses profile edit page
2. **Form Submission**: Updates profile information
3. **Validation**: Server action validates data
4. **Database Update**: Profile updated in `profiles` table
5. **UI Refresh**: Dashboard reflects changes

**Data Storage:**
- **Table**: `profiles`
- **Key Fields**: `user_id`, `full_name`, `headline`, `skills`, `portfolio_url`, `role`, `phone`, `country`, `city`, `bio`, `experience_years`, `education`, `languages[]`, `profile_completion`, `is_verified`
- **Relationships**: Links to `auth.users` via `user_id`

## 🗄️ Database Schema Details

### Core Tables Structure

#### 1. `profiles` Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  headline TEXT,
  skills TEXT,
  portfolio_url TEXT,
  role TEXT DEFAULT 'job_seeker',
  phone TEXT,
  country TEXT,
  city TEXT,
  bio TEXT,
  experience_years INTEGER,
  education TEXT,
  languages TEXT[],
  profile_completion INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  last_active TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 2. `jobs` Table
```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'EUR',
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  experience_level TEXT DEFAULT 'Mid-level',
  visa_sponsorship BOOLEAN DEFAULT false,
  urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  industry TEXT,
  skills TEXT[],
  application_deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 3. `job_applications` Table
```sql
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending',
  cover_letter TEXT,
  resume_path TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(job_id, applicant_id)
);
```

#### 4. `saved_jobs` Table
```sql
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, job_id)
);
```

#### 5. `company_profiles` Table
```sql
CREATE TABLE company_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  description TEXT,
  logo_path TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 6. `legal_services` Table
```sql
CREATE TABLE legal_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_name TEXT NOT NULL,
  description TEXT NOT NULL,
  countries TEXT[] NOT NULL,
  price_range TEXT,
  consultation_fee DECIMAL(10,2),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### 7. `notifications` Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 🔐 Row Level Security (RLS) Policies

### Jobs Table Policies
```sql
-- Employers can manage their own jobs
CREATE POLICY "Employers can manage their own jobs" ON jobs 
FOR ALL USING (auth.uid() = employer_id);

-- Everyone can view active jobs
CREATE POLICY "Everyone can view active jobs" ON jobs 
FOR SELECT USING (status = 'active');
```

### Job Applications Table Policies
```sql
-- Applicants can view their own applications
CREATE POLICY "Applicants can view their own applications" ON job_applications 
FOR SELECT USING (auth.uid() = applicant_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view applications for their jobs" ON job_applications 
FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
);

-- Applicants can create applications
CREATE POLICY "Applicants can create applications" ON job_applications 
FOR INSERT WITH CHECK (auth.uid() = applicant_id);
```

### Saved Jobs Table Policies
```sql
-- Users can manage their own saved jobs
CREATE POLICY "Users can manage their own saved jobs" ON saved_jobs 
FOR ALL USING (auth.uid() = user_id);
```

## 🔄 Complete User Journey Examples

### Example 1: Job Seeker Journey
```
1. Registration: shubhambhaskr123+alt@gmail.com registers as job_seeker
2. Profile Setup: Completes profile with skills, experience, location
3. Job Discovery: Browses jobs page, filters by location/skills
4. Job Application: Applies to "Senior React Developer" at TechCorp
   - Fills cover letter
   - Uploads resume.pdf
   - Submits application
5. Application Tracking: Monitors application status in dashboard
6. Success: Gets hired, receives migration guidance
```

### Example 2: Employer Journey
```
1. Registration: employer@techcorp.com registers as employer
2. Company Setup: Creates company profile for TechCorp
3. Job Posting: Creates "Senior React Developer" job
   - Title: Senior React Developer
   - Company: TechCorp
   - Location: Berlin, Germany
   - Salary: €60,000 - €80,000
   - Visa Sponsorship: Yes
   - Skills: React, TypeScript, Node.js
4. Application Review: Receives applications from job seekers
5. Candidate Selection: Reviews applications, schedules interviews
6. Hiring: Makes offer, assists with visa process
```

## 📁 File Storage Structure

### Supabase Storage Buckets
```
documents/
├── {user_id}/
│   ├── resumes/
│   │   ├── {timestamp}-resume.pdf
│   │   └── {timestamp}-cv.docx
│   ├── certificates/
│   │   └── {timestamp}-certificate.pdf
│   └── other/
│       └── {timestamp}-document.pdf
```

### File Upload Flow
```
1. User selects file in form
2. Client-side validation (size, type)
3. Server action receives file
4. File uploaded to Supabase Storage
5. File path stored in database
6. File accessible via signed URL
```

## 🔍 Data Query Examples

### Get Jobs for Job Seeker
```sql
SELECT 
  j.*,
  cp.company_name,
  cp.industry,
  cp.logo_path
FROM jobs j
LEFT JOIN company_profiles cp ON j.employer_id = cp.employer_id
WHERE j.status = 'active'
ORDER BY j.created_at DESC;
```

### Get Applications for Employer
```sql
SELECT 
  ja.*,
  p.full_name,
  p.headline,
  p.skills,
  j.title as job_title
FROM job_applications ja
JOIN profiles p ON ja.applicant_id = p.user_id
JOIN jobs j ON ja.job_id = j.id
WHERE j.employer_id = auth.uid()
ORDER BY ja.applied_at DESC;
```

### Get User's Saved Jobs
```sql
SELECT 
  j.*,
  cp.company_name,
  cp.logo_path
FROM saved_jobs sj
JOIN jobs j ON sj.job_id = j.id
LEFT JOIN company_profiles cp ON j.employer_id = cp.employer_id
WHERE sj.user_id = auth.uid()
ORDER BY sj.created_at DESC;
```

## 🚨 Error Handling & Validation

### Form Validation
- **Client-side**: Real-time validation using Zod schemas
- **Server-side**: Server action validation before database operations
- **Database**: Constraints and triggers for data integrity

### Common Error Scenarios
1. **Profile Update Error**: Fixed by checking if profile exists before update
2. **Job Application Duplicate**: Prevented by UNIQUE constraint
3. **File Upload Error**: Handled with proper error messages
4. **Permission Error**: RLS policies prevent unauthorized access

## 📊 Performance Considerations

### Indexes
```sql
-- Jobs table indexes
CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_visa_sponsorship ON jobs(visa_sponsorship);

-- Applications table indexes
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
```

### Query Optimization
- Use specific column selection instead of `SELECT *`
- Implement pagination for large datasets
- Use proper JOINs to avoid N+1 queries
- Cache frequently accessed data

## 🔧 Testing Checklist

### Database Operations
- [ ] Profile CRUD operations
- [ ] Job posting and management
- [ ] Job application workflow
- [ ] File upload and storage
- [ ] Role-based access control
- [ ] RLS policy enforcement

### User Flows
- [ ] Complete job seeker journey
- [ ] Complete employer journey
- [ ] Cross-role interactions
- [ ] Error handling scenarios
- [ ] File upload success/failure

### Security
- [ ] Authentication and authorization
- [ ] Data validation and sanitization
- [ ] File upload security
- [ ] SQL injection prevention
- [ ] XSS protection

---

This document provides a comprehensive overview of how data flows through the Altroway platform. Each operation is secured with proper authentication, authorization, and validation to ensure data integrity and user privacy.
