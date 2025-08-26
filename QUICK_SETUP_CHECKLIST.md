# 🚀 Quick Setup Checklist for Altroway

## ✅ **Step-by-Step Setup Guide**

### **Step 1: Environment Setup (5 minutes)**

1. **Create `.env.local` file** in your project root with this content:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yswyapjqdtvydhvycfii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzd3lhcGpxZHR2eWRodnljZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDAwMzIsImV4cCI6MjA2ODUxNjAzMn0.Gn7-LIHNwLWPO2l8qJIKGjovPY3MvJuoomjEZq2dgCA
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI Configuration (for chat functionality)
GROQ_API_KEY=your_groq_api_key_here
```

2. **Get your Service Role Key**:
   - Go to https://supabase.com/dashboard/project/yswyapjqdtvydhvycfii
   - Navigate to Settings → API
   - Copy the "service_role" key
   - Replace `your_service_role_key_here` in `.env.local`

### **Step 2: Database Migration (10 minutes)**

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/yswyapjqdtvydhvycfii
2. **Click on "SQL Editor"** in the left sidebar
3. **Copy the entire content** from `database-migration.sql`
4. **Paste it into the SQL Editor**
5. **Click "Run"** to execute the migration

### **Step 3: Storage Setup (5 minutes)**

1. **Go to Storage** in Supabase Dashboard
2. **Create two buckets**:
   - **Documents Bucket**: Name `documents`, Public `false`
   - **Avatars Bucket**: Name `avatars`, Public `true`
3. **Apply Storage Policies**:
   - Go back to SQL Editor
   - Copy the content from `storage-policies.sql`
   - Paste and run the SQL

### **Step 4: Test Application (5 minutes)**

1. **Start the development server**:
```bash
npm run dev
```

2. **Test the application**:
   - Open http://localhost:3000
   - Try to register a new user
   - Test profile updates
   - Test job posting (as employer)
   - Test job application (as job seeker)

## 🎯 **Expected Results**

After completing all steps:
- ✅ Application starts without errors
- ✅ User registration works
- ✅ Profile updates work
- ✅ Job posting works
- ✅ Job applications work
- ✅ File uploads work
- ✅ No database constraint errors

## 🚨 **Troubleshooting**

### **If you get "Table already exists" errors**:
- The migration includes `DROP TABLE IF EXISTS` statements
- This will safely remove existing tables and recreate them

### **If you get authentication errors**:
- Verify your Supabase credentials in `.env.local`
- Make sure the service role key is correct

### **If file uploads don't work**:
- Verify storage buckets are created
- Check that storage policies are applied

### **If the application doesn't start**:
- Check that `.env.local` exists and has correct values
- Restart the development server: `npm run dev`

## 📞 **Support**

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Supabase project settings
3. Ensure all environment variables are correctly set
4. Test the database connection in Supabase Dashboard

---

**🎯 Follow these steps in order to get your application fully functional!**
