# 🧪 Altroway Testing Guide

## 🎯 Quick Start Testing

### Prerequisites
1. **Database Migration Applied**: Run `supabase/migrations/05_complete_schema.sql` in Supabase
2. **Environment Setup**: `.env.local` configured with Supabase credentials
3. **Development Server**: `npm run dev` running on `http://localhost:3000`

## 🔄 Complete Testing Flow

### Step 1: Test User Registration & Authentication

#### 1.1 Create Job Seeker Account
```
1. Go to http://localhost:3000/register
2. Fill registration form:
   - Email: test-jobseeker@example.com
   - Password: TestPassword123!
   - Role: job_seeker
3. Verify email (check Supabase dashboard or email)
4. Login and verify redirect to dashboard
```

**Expected Results:**
- ✅ User created in `auth.users` table
- ✅ Profile created in `profiles` table with `role = 'job_seeker'`
- ✅ Redirected to job seeker dashboard
- ✅ Can access profile edit page

#### 1.2 Create Employer Account
```
1. Go to http://localhost:3000/register
2. Fill registration form:
   - Email: test-employer@example.com
   - Password: TestPassword123!
   - Role: employer
3. Verify email and login
4. Verify redirect to employer dashboard
```

**Expected Results:**
- ✅ User created in `auth.users` table
- ✅ Profile created in `profiles` table with `role = 'employer'`
- ✅ Redirected to employer dashboard with job creation form
- ✅ Can access employer-specific features

### Step 2: Test Profile Management

#### 2.1 Update Job Seeker Profile
```
1. Login as job seeker
2. Go to Profile Edit page
3. Fill form:
   - Full Name: John Doe
   - Headline: Senior React Developer
   - Skills: React, TypeScript, Node.js
   - Portfolio URL: https://johndoe.dev
4. Click "Save Changes"
```

**Expected Results:**
- ✅ Profile updated in `profiles` table
- ✅ Success message displayed
- ✅ Dashboard reflects changes
- ✅ No database errors

#### 2.2 Update Employer Profile
```
1. Login as employer
2. Go to Profile Edit page
3. Fill form:
   - Full Name: Jane Smith
   - Headline: HR Manager at TechCorp
   - Skills: Recruitment, HR Management
   - Portfolio URL: https://techcorp.com
4. Click "Save Changes"
```

**Expected Results:**
- ✅ Profile updated successfully
- ✅ Can access employer dashboard features

### Step 3: Test Job Posting (Employer)

#### 3.1 Create Job Posting
```
1. Login as employer
2. In employer dashboard, click "Create New Job"
3. Fill job form:
   - Title: Senior React Developer
   - Company: TechCorp
   - Location: Berlin, Germany
   - Min Salary: 60000
   - Max Salary: 80000
   - Description: We are looking for a senior React developer...
   - Requirements: 5+ years experience, React, TypeScript
   - Benefits: Health insurance, remote work, visa sponsorship
   - Job Type: Full-time
   - Experience Level: Senior
   - Check "Visa Sponsorship Available"
   - Industry: Technology
   - Skills: React, TypeScript, Node.js
4. Click "Create Job"
```

**Expected Results:**
- ✅ Job created in `jobs` table
- ✅ Success message displayed
- ✅ Job appears in employer's job list
- ✅ Job visible to job seekers (if status = 'active')

#### 3.2 Verify Job Data in Database
```sql
-- Check job was created
SELECT * FROM jobs WHERE employer_id = 'your-employer-user-id';

-- Verify RLS policies work
-- This should return the job for the employer
SELECT * FROM jobs WHERE employer_id = auth.uid();

-- This should return active jobs for job seekers
SELECT * FROM jobs WHERE status = 'active';
```

### Step 4: Test Job Application (Job Seeker)

#### 4.1 Apply to Job
```
1. Login as job seeker
2. Go to Jobs page
3. Find the job posted by employer
4. Click "Apply"
5. Fill application form:
   - Cover Letter: I am excited to apply for this position...
   - Upload Resume: Select a PDF file
6. Click "Submit Application"
```

**Expected Results:**
- ✅ Application created in `job_applications` table
- ✅ Resume uploaded to Supabase Storage
- ✅ Success message displayed
- ✅ Application appears in job seeker's dashboard

#### 4.2 Verify Application Data
```sql
-- Check application was created
SELECT 
  ja.*,
  p.full_name as applicant_name,
  j.title as job_title
FROM job_applications ja
JOIN profiles p ON ja.applicant_id = p.user_id
JOIN jobs j ON ja.job_id = j.id
WHERE ja.applicant_id = 'your-jobseeker-user-id';

-- Verify RLS policies
-- Job seeker can see their own applications
SELECT * FROM job_applications WHERE applicant_id = auth.uid();

-- Employer can see applications for their jobs
SELECT * FROM job_applications ja
JOIN jobs j ON ja.job_id = j.id
WHERE j.employer_id = auth.uid();
```

### Step 5: Test Employer Application Review

#### 5.1 Review Applications
```
1. Login as employer
2. Go to employer dashboard
3. Click "Applications" tab
4. Verify application from job seeker appears
5. Check application details:
   - Applicant name
   - Cover letter
   - Resume download link
   - Application date
```

**Expected Results:**
- ✅ Application visible in employer dashboard
- ✅ Can view applicant details
- ✅ Can download resume
- ✅ Application status shows "pending"

#### 5.2 Update Application Status
```
1. In employer dashboard, find the application
2. Click "Review" button
3. Update status to "shortlisted" or "rejected"
4. Add notes if needed
```

**Expected Results:**
- ✅ Application status updated in database
- ✅ Job seeker can see status change in their dashboard

### Step 6: Test File Upload System

#### 6.1 Upload Resume
```
1. Login as job seeker
2. Go to dashboard
3. Use document upload feature
4. Upload a PDF file
5. Verify file appears in documents list
```

**Expected Results:**
- ✅ File uploaded to Supabase Storage
- ✅ File record created in `documents` table
- ✅ File accessible via download link

#### 6.2 Verify File Storage
```sql
-- Check document was created
SELECT * FROM documents WHERE user_id = 'your-user-id';

-- Verify file path structure
-- Should be: {user_id}/resumes/{timestamp}-filename.pdf
```

### Step 7: Test Role-Based Access Control

#### 7.1 Test Job Seeker Restrictions
```
1. Login as job seeker
2. Try to access employer-only features:
   - Job creation form
   - Application review
   - Company profile management
```

**Expected Results:**
- ❌ Cannot access employer features
- ✅ Redirected to appropriate pages
- ✅ Error messages for unauthorized actions

#### 7.2 Test Employer Restrictions
```
1. Login as employer
2. Try to access job seeker features:
   - Job applications (as applicant)
   - Document uploads
```

**Expected Results:**
- ❌ Cannot access job seeker features
- ✅ Proper access control enforced

### Step 8: Test Error Handling

#### 8.1 Test Profile Update Error
```
1. Login as any user
2. Go to profile edit
3. Submit form with invalid data:
   - Empty required fields
   - Invalid URL format
   - Very long text
```

**Expected Results:**
- ✅ Client-side validation shows errors
- ✅ Server-side validation prevents invalid data
- ✅ No database errors or crashes

#### 8.2 Test Duplicate Application
```
1. Login as job seeker
2. Apply to the same job twice
```

**Expected Results:**
- ❌ Second application should fail
- ✅ UNIQUE constraint prevents duplicates
- ✅ Proper error message displayed

## 🔍 Database Verification Queries

### Check All Users and Roles
```sql
SELECT 
  u.email,
  p.full_name,
  p.role,
  p.created_at
FROM auth.users u
JOIN profiles p ON u.id = p.user_id
ORDER BY p.created_at DESC;
```

### Check Job Postings
```sql
SELECT 
  j.title,
  j.company,
  j.location,
  j.salary_min,
  j.salary_max,
  j.status,
  p.full_name as employer_name,
  j.created_at
FROM jobs j
JOIN profiles p ON j.employer_id = p.user_id
ORDER BY j.created_at DESC;
```

### Check Applications
```sql
SELECT 
  j.title as job_title,
  p1.full_name as applicant_name,
  p2.full_name as employer_name,
  ja.status,
  ja.applied_at
FROM job_applications ja
JOIN jobs j ON ja.job_id = j.id
JOIN profiles p1 ON ja.applicant_id = p1.user_id
JOIN profiles p2 ON j.employer_id = p2.user_id
ORDER BY ja.applied_at DESC;
```

### Check File Uploads
```sql
SELECT 
  d.filename,
  d.file_path,
  d.file_type,
  p.full_name as user_name,
  d.created_at
FROM documents d
JOIN profiles p ON d.user_id = p.user_id
ORDER BY d.created_at DESC;
```

## 🚨 Common Issues & Solutions

### Issue 1: Profile Update Error
**Error**: `"null value in column "id" of relation "profiles" violates not-null constraint"`

**Solution**: 
1. Check if database migration was applied correctly
2. Verify profile exists before update
3. Check RLS policies

### Issue 2: Job Creation Fails
**Error**: `"Only employers can create job postings"`

**Solution**:
1. Verify user role is set to "employer"
2. Check profile exists in database
3. Verify role field is not null

### Issue 3: Application Not Visible
**Error**: Application not showing in employer dashboard

**Solution**:
1. Check RLS policies are applied
2. Verify job belongs to the employer
3. Check application status

### Issue 4: File Upload Fails
**Error**: File upload error or file not accessible

**Solution**:
1. Check Supabase Storage bucket exists
2. Verify storage policies
3. Check file size and type restrictions

## ✅ Testing Checklist

### Authentication & Authorization
- [ ] User registration with different roles
- [ ] Email verification
- [ ] Login/logout functionality
- [ ] Role-based access control
- [ ] Profile creation on signup

### Profile Management
- [ ] Profile creation and updates
- [ ] Form validation
- [ ] Error handling
- [ ] Data persistence

### Job Posting System
- [ ] Job creation by employers
- [ ] Job listing and filtering
- [ ] Job status management
- [ ] RLS policy enforcement

### Application System
- [ ] Job applications by job seekers
- [ ] Application tracking
- [ ] Status updates by employers
- [ ] Duplicate prevention

### File Management
- [ ] File upload functionality
- [ ] File storage and retrieval
- [ ] File type validation
- [ ] Storage security

### Dashboard Functionality
- [ ] Role-specific dashboards
- [ ] Data display and updates
- [ ] Navigation and routing
- [ ] Real-time updates

### Security & Performance
- [ ] RLS policy testing
- [ ] Data validation
- [ ] Error handling
- [ ] Performance optimization

---

**Note**: This testing guide covers the core functionality. For production deployment, additional testing should include load testing, security testing, and user acceptance testing.
