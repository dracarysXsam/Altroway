#!/bin/bash

# 🚀 Altroway - Complete Setup and Test Script
# This script removes mock data, generates real data, and runs comprehensive tests

echo "🚀 Starting Altroway Setup and Test Process..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check if Supabase is configured
print_status "Checking Supabase configuration..."

if [ ! -f ".env.local" ]; then
    print_error ".env.local file not found!"
    print_warning "Please create .env.local with your Supabase credentials:"
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    exit 1
fi

print_success "Supabase configuration found"

# Step 2: Install dependencies
print_status "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Install Playwright for testing
print_status "Installing Playwright for testing..."
npx playwright install

if [ $? -eq 0 ]; then
    print_success "Playwright installed successfully"
else
    print_warning "Playwright installation failed, but continuing..."
fi

# Step 4: Apply database migration
print_status "Applying database migration..."
print_warning "Please run the following SQL in your Supabase SQL Editor:"
echo ""
echo "1. Go to your Supabase Dashboard"
echo "2. Click on 'SQL Editor'"
echo "3. Copy and paste the content from: scripts/remove-mock-data.sql"
echo "4. Click 'Run'"
echo "5. Then copy and paste the content from: scripts/generate-real-data.sql"
echo "6. Click 'Run'"
echo ""

read -p "Have you applied the database migrations? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Database migration required before continuing"
    exit 1
fi

print_success "Database migration applied"

# Step 5: Set up storage buckets
print_status "Setting up Supabase Storage buckets..."
print_warning "Please create the following buckets in your Supabase Storage:"
echo ""
echo "1. Go to Storage in Supabase Dashboard"
echo "2. Create bucket: 'documents' (private)"
echo "3. Create bucket: 'avatars' (public)"
echo "4. Apply storage policies from QUICK_FIX_GUIDE.md"
echo ""

read -p "Have you set up the storage buckets? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Storage setup required before continuing"
    exit 1
fi

print_success "Storage buckets configured"

# Step 6: Start development server
print_status "Starting development server..."
npm run dev &
DEV_SERVER_PID=$!

# Wait for server to start
sleep 10

# Check if server is running
if curl -s http://localhost:3001 > /dev/null; then
    print_success "Development server started successfully"
else
    print_error "Failed to start development server"
    kill $DEV_SERVER_PID 2>/dev/null
    exit 1
fi

# Step 7: Run tests
print_status "Running comprehensive test suite..."

# Create test configuration
cat > playwright.config.js << 'EOF'
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
});
EOF

# Run tests
npx playwright test

TEST_EXIT_CODE=$?

# Step 8: Generate test report
if [ $TEST_EXIT_CODE -eq 0 ]; then
    print_success "All tests passed!"
    print_status "Generating test report..."
    npx playwright show-report
else
    print_error "Some tests failed"
    print_status "Generating test report for failed tests..."
    npx playwright show-report
fi

# Step 9: Cleanup
print_status "Cleaning up..."
kill $DEV_SERVER_PID 2>/dev/null

# Step 10: Summary
echo ""
echo "================================================"
echo "🎉 Altroway Setup and Test Process Complete!"
echo "================================================"
echo ""
echo "✅ Database: Real user-generated data loaded"
echo "✅ Storage: Buckets configured"
echo "✅ Application: All hardcoded data removed"
echo "✅ Tests: Comprehensive test suite executed"
echo ""
echo "📊 Test Results:"
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "   🟢 All tests passed"
else
    echo "   🔴 Some tests failed - check the report"
fi
echo ""
echo "🚀 Next Steps:"
echo "   1. Review test results in the generated report"
echo "   2. Test the application manually at http://localhost:3001"
echo "   3. Create real user accounts and test all features"
echo "   4. Monitor the application for any issues"
echo ""
echo "📚 Documentation:"
echo "   - QUICK_FIX_GUIDE.md: Quick fixes for common issues"
echo "   - PHASE1_COMPLETION_GUIDE.md: Complete setup guide"
echo "   - TESTING_GUIDE.md: Manual testing instructions"
echo ""

# Exit with test status
exit $TEST_EXIT_CODE
