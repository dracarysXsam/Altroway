// Comprehensive Test Suite for Altroway
// Run with: npm test

const { test, expect } = require('@playwright/test');

// Test Configuration
const BASE_URL = 'http://localhost:3001';
const TEST_TIMEOUT = 30000;

// Test Data
const testUsers = {
  jobSeeker: {
    email: 'test.jobseeker@example.com',
    password: 'TestPassword123!',
    name: 'Test Job Seeker',
    role: 'job_seeker'
  },
  employer: {
    email: 'test.employer@example.com',
    password: 'TestPassword123!',
    name: 'Test Employer',
    role: 'employer'
  },
  legalAdvisor: {
    email: 'test.advisor@example.com',
    password: 'TestPassword123!',
    name: 'Test Legal Advisor',
    role: 'legal_advisor'
  }
};

// Test Suite 1: Authentication & User Management
test.describe('Authentication & User Management', () => {
  test('User Registration', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await page.fill('[name="email"]', testUsers.jobSeeker.email);
    await page.fill('[name="password"]', testUsers.jobSeeker.password);
    await page.fill('[name="fullName"]', testUsers.jobSeeker.name);
    await page.click('button[type="submit"]');
    
    // Should redirect to login or show success message
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('User Login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.jobSeeker.email);
    await page.fill('[name="password"]', testUsers.jobSeeker.password);
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test('Profile Update', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.jobSeeker.email);
    await page.fill('[name="password"]', testUsers.jobSeeker.password);
    await page.click('button[type="submit"]');
    
    // Go to profile edit
    await page.goto(`${BASE_URL}/profile/edit`);
    await page.fill('[name="fullName"]', 'Updated Name');
    await page.fill('[name="headline"]', 'Updated Headline');
    await page.fill('[name="skills"]', 'React, TypeScript, Node.js');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });
});

// Test Suite 2: Job Management
test.describe('Job Management', () => {
  test('Job Creation (Employer)', async ({ page }) => {
    // Login as employer
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.employer.email);
    await page.fill('[name="password"]', testUsers.employer.password);
    await page.click('button[type="submit"]');
    
    // Go to dashboard and create job
    await page.goto(`${BASE_URL}/dashboard`);
    await page.click('text=Create Job');
    
    // Fill job form
    await page.fill('[name="title"]', 'Test Job Title');
    await page.fill('[name="company"]', 'Test Company');
    await page.fill('[name="location"]', 'Berlin, Germany');
    await page.fill('[name="description"]', 'This is a test job description with more than 10 characters.');
    await page.selectOption('[name="job_type"]', 'Full-time');
    await page.selectOption('[name="experience_level"]', 'Mid-level');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Job created successfully')).toBeVisible();
  });

  test('Job Search & Filtering', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`);
    
    // Test search functionality
    await page.fill('[placeholder*="Search"]', 'React');
    await page.keyboard.press('Enter');
    
    // Should show filtered results
    await expect(page.locator('.job-card')).toHaveCount(1);
  });

  test('Job Application', async ({ page }) => {
    // Login as job seeker
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.jobSeeker.email);
    await page.fill('[name="password"]', testUsers.jobSeeker.password);
    await page.click('button[type="submit"]');
    
    // Go to jobs and apply
    await page.goto(`${BASE_URL}/jobs`);
    await page.click('text=Apply');
    
    // Fill application form
    await page.fill('[name="coverLetter"]', 'I am interested in this position.');
    await page.click('button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('text=Application submitted successfully')).toBeVisible();
  });
});

// Test Suite 3: Dashboard Functionality
test.describe('Dashboard Functionality', () => {
  test('Employer Dashboard', async ({ page }) => {
    // Login as employer
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.employer.email);
    await page.fill('[name="password"]', testUsers.employer.password);
    await page.click('button[type="submit"]');
    
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should show employer-specific content
    await expect(page.locator('text=Create Job')).toBeVisible();
    await expect(page.locator('text=Posted Jobs')).toBeVisible();
  });

  test('Job Seeker Dashboard', async ({ page }) => {
    // Login as job seeker
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.jobSeeker.email);
    await page.fill('[name="password"]', testUsers.jobSeeker.password);
    await page.click('button[type="submit"]');
    
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should show job seeker-specific content
    await expect(page.locator('text=My Applications')).toBeVisible();
    await expect(page.locator('text=Saved Jobs')).toBeVisible();
  });
});

// Test Suite 4: Data Validation
test.describe('Data Validation', () => {
  test('Form Validation - Required Fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    
    // Try to submit without required fields
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('Form Validation - Email Format', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    
    // Enter invalid email
    await page.fill('[name="email"]', 'invalid-email');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    await expect(page.locator('text=Please enter a valid email')).toBeVisible();
  });

  test('Form Validation - Password Strength', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    
    // Enter weak password
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'weak');
    await page.click('button[type="submit"]');
    
    // Should show password strength error
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });
});

// Test Suite 5: Error Handling
test.describe('Error Handling', () => {
  test('Invalid Login Credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
  });

  test('Unauthorized Access', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('404 Page', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page`);
    
    // Should show 404 page
    await expect(page.locator('text=Page not found')).toBeVisible();
  });
});

// Test Suite 6: Performance & Loading States
test.describe('Performance & Loading States', () => {
  test('Page Load Times', async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`${BASE_URL}/`);
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Loading States', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`);
    
    // Should show loading state initially
    await expect(page.locator('text=Loading...')).toBeVisible();
    
    // Should load content eventually
    await expect(page.locator('.job-card')).toBeVisible({ timeout: 10000 });
  });
});

// Test Suite 7: Responsive Design
test.describe('Responsive Design', () => {
  test('Mobile Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`);
    
    // Should show mobile menu
    await page.click('[aria-label="Menu"]');
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('Desktop Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/`);
    
    // Should show desktop navigation
    await expect(page.locator('text=Jobs')).toBeVisible();
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});

// Test Suite 8: Database Operations
test.describe('Database Operations', () => {
  test('CRUD Operations - Create', async ({ page }) => {
    // Test job creation
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.employer.email);
    await page.fill('[name="password"]', testUsers.employer.password);
    await page.click('button[type="submit"]');
    
    await page.goto(`${BASE_URL}/dashboard`);
    await page.click('text=Create Job');
    
    const jobTitle = `Test Job ${Date.now()}`;
    await page.fill('[name="title"]', jobTitle);
    await page.fill('[name="company"]', 'Test Company');
    await page.fill('[name="location"]', 'Berlin, Germany');
    await page.fill('[name="description"]', 'Test job description with sufficient length.');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Job created successfully')).toBeVisible();
  });

  test('CRUD Operations - Read', async ({ page }) => {
    await page.goto(`${BASE_URL}/jobs`);
    
    // Should display jobs from database
    await expect(page.locator('.job-card')).toBeVisible();
  });

  test('CRUD Operations - Update', async ({ page }) => {
    // Login and update profile
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.jobSeeker.email);
    await page.fill('[name="password"]', testUsers.jobSeeker.password);
    await page.click('button[type="submit"]');
    
    await page.goto(`${BASE_URL}/profile/edit`);
    await page.fill('[name="headline"]', 'Updated Headline');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Profile updated successfully')).toBeVisible();
  });

  test('CRUD Operations - Delete', async ({ page }) => {
    // Login as employer and delete a job
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', testUsers.employer.email);
    await page.fill('[name="password"]', testUsers.employer.password);
    await page.click('button[type="submit"]');
    
    await page.goto(`${BASE_URL}/dashboard`);
    await page.click('text=Delete');
    await page.click('text=Confirm');
    
    await expect(page.locator('text=Job deleted successfully')).toBeVisible();
  });
});

// Test Suite 9: Security
test.describe('Security', () => {
  test('SQL Injection Prevention', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Try SQL injection in email field
    await page.fill('[name="email"]', "'; DROP TABLE users; --");
    await page.fill('[name="password"]', 'test');
    await page.click('button[type="submit"]');
    
    // Should not crash and should show validation error
    await expect(page.locator('text=Invalid login credentials')).toBeVisible();
  });

  test('XSS Prevention', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    
    // Try XSS in name field
    await page.fill('[name="fullName"]', '<script>alert("XSS")</script>');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // Should not execute script
    await expect(page.locator('script')).not.toBeVisible();
  });
});

// Test Suite 10: Integration Tests
test.describe('Integration Tests', () => {
  test('Complete User Journey - Job Seeker', async ({ page }) => {
    // 1. Register
    await page.goto(`${BASE_URL}/register`);
    await page.fill('[name="email"]', 'journey.seeker@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.fill('[name="fullName"]', 'Journey Seeker');
    await page.click('button[type="submit"]');
    
    // 2. Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', 'journey.seeker@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // 3. Update Profile
    await page.goto(`${BASE_URL}/profile/edit`);
    await page.fill('[name="headline"]', 'Experienced Developer');
    await page.fill('[name="skills"]', 'React, TypeScript, Node.js');
    await page.click('button[type="submit"]');
    
    // 4. Browse Jobs
    await page.goto(`${BASE_URL}/jobs`);
    await expect(page.locator('.job-card')).toBeVisible();
    
    // 5. Apply to Job
    await page.click('text=Apply');
    await page.fill('[name="coverLetter"]', 'I am interested in this position.');
    await page.click('button[type="submit"]');
    
    // 6. Check Dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=My Applications')).toBeVisible();
  });

  test('Complete User Journey - Employer', async ({ page }) => {
    // 1. Register as employer
    await page.goto(`${BASE_URL}/register`);
    await page.fill('[name="email"]', 'journey.employer@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.fill('[name="fullName"]', 'Journey Employer');
    await page.click('button[type="submit"]');
    
    // 2. Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('[name="email"]', 'journey.employer@example.com');
    await page.fill('[name="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    
    // 3. Create Job
    await page.goto(`${BASE_URL}/dashboard`);
    await page.click('text=Create Job');
    await page.fill('[name="title"]', 'Integration Test Job');
    await page.fill('[name="company"]', 'Test Company');
    await page.fill('[name="location"]', 'Berlin, Germany');
    await page.fill('[name="description"]', 'This is a test job for integration testing.');
    await page.click('button[type="submit"]');
    
    // 4. Verify Job Created
    await expect(page.locator('text=Job created successfully')).toBeVisible();
  });
});

// Test Configuration
test.beforeEach(async ({ page }) => {
  // Set timeout for all tests
  test.setTimeout(TEST_TIMEOUT);
});

test.afterEach(async ({ page }) => {
  // Clean up after each test
  await page.close();
});

// Export test configuration
module.exports = {
  testUsers,
  BASE_URL,
  TEST_TIMEOUT
};
