# 🧪 **Test Guide: Messaging System Verification**

## 🎯 **What to Test:**

### **1. Job Application Flow:**
1. **Register as Job Seeker** (Account 1)
2. **Register as Employer** (Account 2)
3. **Create a job** with Account 2
4. **Apply to the job** with Account 1
5. **Verify conversation is created** automatically

### **2. Employer Dashboard:**
1. **Login as Employer** (Account 2)
2. **Check Applications tab** - should show the application
3. **Verify application details** are visible
4. **Test status updates** (pending → reviewed → shortlisted)

### **3. Messaging System:**
1. **Send message** from employer to applicant
2. **Check conversation** appears in messages
3. **Verify applicant can see** the message
4. **Test two-way communication**

## 📋 **Step-by-Step Testing:**

### **Step 1: Setup Test Accounts**
```bash
# Account 1: Job Seeker
Email: testseeker@example.com
Password: testpass123

# Account 2: Employer  
Email: testemployer@example.com
Password: testpass123
```

### **Step 2: Create Job (Employer Account)**
1. Login as `testemployer@example.com`
2. Go to Dashboard
3. Click "Create New Job"
4. Fill in job details:
   - Title: "Test Software Engineer"
   - Company: "Test Corp"
   - Location: "Berlin, Germany"
   - Description: "Test job for messaging system"
5. Click "Create Job"
6. Verify job appears in "My Jobs" tab

### **Step 3: Apply to Job (Job Seeker Account)**
1. Login as `testseeker@example.com`
2. Go to Jobs page
3. Find "Test Software Engineer" job
4. Click "Apply"
5. Fill application form:
   - Cover Letter: "I'm interested in this position"
   - Upload resume (optional)
6. Click "Submit Application"
7. Verify success message

### **Step 4: Check Employer Dashboard**
1. Login as `testemployer@example.com`
2. Go to Dashboard
3. Click "Applications" tab
4. Verify application appears with:
   - Applicant name: "Test Seeker"
   - Job title: "Test Software Engineer"
   - Status: "pending"
   - Cover letter visible

### **Step 5: Test Messaging**
1. **From Employer Dashboard:**
   - Click "Message" button on application
   - Type: "Thank you for your application. When are you available for an interview?"
   - Click "Send Message"

2. **Check Messages Page:**
   - Go to `/messages` as employer
   - Verify conversation appears
   - Click on conversation to view

3. **From Job Seeker Account:**
   - Login as `testseeker@example.com`
   - Go to `/messages`
   - Verify conversation appears
   - Reply: "Thank you! I'm available next week."

### **Step 6: Verify Two-Way Communication**
1. **Check both accounts** can see the conversation
2. **Verify messages** appear in real-time
3. **Test status updates** from employer dashboard
4. **Verify conversation** shows job context

## 🔍 **What to Look For:**

### **✅ Success Indicators:**
- Application appears in employer dashboard
- Conversation created automatically
- Messages sent and received
- Job context visible in conversations
- Status updates work
- Real-time messaging

### **❌ Common Issues:**
- Applications not showing (check database queries)
- Conversations not created (check triggers)
- Messages not sending (check permissions)
- Missing job context (check joins)

## 🐛 **Debugging Steps:**

### **If Applications Don't Show:**
1. Check browser console for errors
2. Verify database migration ran successfully
3. Check RLS policies are correct
4. Verify user roles are set correctly

### **If Messages Don't Work:**
1. Check conversation creation
2. Verify message permissions
3. Check database connections
4. Verify user authentication

### **If Conversations Missing:**
1. Check `conversations` table exists
2. Verify trigger function works
3. Check application IDs match
4. Verify foreign key constraints

## 📊 **Expected Database State:**

### **After Testing:**
```sql
-- Check applications
SELECT * FROM job_applications;

-- Check conversations  
SELECT * FROM conversations;

-- Check messages
SELECT * FROM messages;

-- Check profiles have correct roles
SELECT user_id, role FROM profiles;
```

## 🎉 **Success Criteria:**

- ✅ **Employer can see applications**
- ✅ **Conversations created automatically**
- ✅ **Messages sent and received**
- ✅ **Job context visible**
- ✅ **Status updates work**
- ✅ **Real-time communication**

---

**🚀 Run through this test guide to verify your messaging system is working correctly!**
