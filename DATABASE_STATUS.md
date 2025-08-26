# 🗄️ Database Migration Status & Fix Guide

## 🚨 Critical Database Issues

Based on the errors, your database schema is incomplete. The profile update error indicates missing tables or incorrect structure.

## 🔧 Immediate Fix Steps

### Step 1: Apply Complete Database Migration

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/yswyapjqdtvydhvycfii
2. **Navigate to SQL Editor**: Click on "SQL Editor" in the left sidebar
3. **Run Complete Migration**: Copy and paste the entire content from `supabase/migrations/05_complete_schema.sql`

### Step 2: Verify Migration Success

Run these queries to verify the migration worked:

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'jobs', 'job_applications', 'saved_jobs', 'company_profiles', 'legal_services', 'notifications');

-- Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'jobs', 'job_applications', 'saved_jobs', 'company_profiles', 'legal_services', 'notifications');
```

### Step 3: Check Existing Data

```sql
-- Check existing profiles
SELECT * FROM profiles LIMIT 5;

-- Check if any profiles are missing user_id
SELECT * FROM profiles WHERE user_id IS NULL;

-- Check auth users
SELECT id, email, created_at FROM auth.users LIMIT 5;
```

## 🚨 Common Migration Issues

### Issue 1: "Table already exists"
**Solution**: Drop existing tables first:

```sql
-- Drop existing tables (WARNING: This will delete all data)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS legal_services CASCADE;
DROP TABLE IF EXISTS company_profiles CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
```

### Issue 2: "Column already exists"
**Solution**: Use `ADD COLUMN IF NOT EXISTS` in the migration:

```sql
-- This is already in the migration, but verify
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS experience_years INTEGER,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_active TIMESTAMPTZ DEFAULT now();
```

### Issue 3: "Policy already exists"
**Solution**: Drop existing policies first:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Employers can manage their own jobs" ON jobs;
DROP POLICY IF EXISTS "Everyone can view active jobs" ON jobs;
DROP POLICY IF EXISTS "Applicants can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Employers can view applications for their jobs" ON job_applications;
DROP POLICY IF EXISTS "Applicants can create applications" ON job_applications;
DROP POLICY IF EXISTS "Users can manage their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Employers can manage their own company profile" ON company_profiles;
DROP POLICY IF EXISTS "Everyone can view company profiles" ON company_profiles;
DROP POLICY IF EXISTS "Legal advisors can manage their own services" ON legal_services;
DROP POLICY IF EXISTS "Everyone can view legal services" ON legal_services;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
```

## 🔍 Verification Checklist

After running the migration, verify:

- [ ] All tables exist (`profiles`, `jobs`, `job_applications`, etc.)
- [ ] All columns exist in `profiles` table
- [ ] RLS is enabled on all tables
- [ ] All policies are created
- [ ] Indexes are created
- [ ] Triggers are created

## 🚀 Quick Fix Script

If you want to start fresh, run this complete script:

```sql
-- 1. Drop existing tables
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS legal_services CASCADE;
DROP TABLE IF EXISTS company_profiles CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Run the complete migration from 05_complete_schema.sql
-- (Copy the entire content from that file here)

-- 3. Verify migration
SELECT 'Migration completed successfully' as status;
```

## 📊 Expected Database Structure

After successful migration, you should have:

### Tables:
- `profiles` - User profiles with role-based data
- `jobs` - Job postings by employers
- `job_applications` - Applications from job seekers
- `saved_jobs` - Jobs saved by users
- `company_profiles` - Company information for employers
- `legal_services` - Services offered by legal advisors
- `notifications` - User notifications

### Key Features:
- ✅ Row Level Security (RLS) enabled
- ✅ Proper foreign key relationships
- ✅ Indexes for performance
- ✅ Triggers for `updated_at` timestamps
- ✅ UNIQUE constraints where needed

---

**After completing these steps, restart your development server and test the profile update functionality.**
