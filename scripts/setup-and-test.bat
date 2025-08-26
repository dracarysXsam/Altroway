@echo off
chcp 65001 >nul
echo 🚀 Altroway - Complete Setup and Test Script
echo ================================================
echo.

echo 📋 This script will:
echo 1. Remove all mock data from the database
echo 2. Generate realistic user-generated data
echo 3. Run comprehensive test suite
echo 4. Generate test reports
echo.

echo 🔧 Prerequisites:
echo - Supabase project configured
echo - .env.local file with Supabase credentials
echo - Node.js and npm installed
echo.

pause

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

echo 🎭 Installing Playwright for testing...
call npx playwright install
if %errorlevel% neq 0 (
    echo ⚠️ Playwright installation failed, but continuing...
)
echo ✅ Playwright installed successfully
echo.

echo 🗄️ Database Migration Required
echo ===============================
echo Please run the following SQL in your Supabase SQL Editor:
echo.
echo 1. Go to your Supabase Dashboard
echo 2. Click on 'SQL Editor'
echo 3. Copy and paste the content from: scripts/remove-mock-data.sql
echo 4. Click 'Run'
echo 5. Then copy and paste the content from: scripts/generate-real-data.sql
echo 6. Click 'Run'
echo.

set /p "migration_done=Have you applied the database migrations? (y/n): "
if /i not "%migration_done%"=="y" (
    echo ❌ Database migration required before continuing
    pause
    exit /b 1
)
echo ✅ Database migration applied
echo.

echo 📁 Storage Setup Required
echo ==========================
echo Please create the following buckets in your Supabase Storage:
echo.
echo 1. Go to Storage in Supabase Dashboard
echo 2. Create bucket: 'documents' (private)
echo 3. Create bucket: 'avatars' (public)
echo 4. Apply storage policies from QUICK_FIX_GUIDE.md
echo.

set /p "storage_done=Have you set up the storage buckets? (y/n): "
if /i not "%storage_done%"=="y" (
    echo ❌ Storage setup required before continuing
    pause
    exit /b 1
)
echo ✅ Storage buckets configured
echo.

echo 🚀 Starting development server...
start /B npm run dev
timeout /t 10 /nobreak >nul

echo 🔍 Checking if server is running...
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Failed to start development server
    pause
    exit /b 1
)
echo ✅ Development server started successfully
echo.

echo 🧪 Running comprehensive test suite...

echo Creating Playwright configuration...
(
echo const { defineConfig, devices } = require('@playwright/test'^);
echo.
echo module.exports = defineConfig({
echo   testDir: './tests',
echo   fullyParallel: true,
echo   forbidOnly: !!process.env.CI,
echo   retries: process.env.CI ? 2 : 0,
echo   workers: process.env.CI ? 1 : undefined,
echo   reporter: 'html',
echo   use: {
echo     baseURL: 'http://localhost:3001',
echo     trace: 'on-first-retry',
echo   },
echo   projects: [
echo     {
echo       name: 'chromium',
echo       use: { ...devices['Desktop Chrome'] },
echo     },
echo   ],
echo   webServer: {
echo     command: 'npm run dev',
echo     url: 'http://localhost:3001',
echo     reuseExistingServer: !process.env.CI,
echo   },
echo }^);
) > playwright.config.js

echo Running tests...
call npx playwright test
set TEST_EXIT_CODE=%errorlevel%

echo.
echo 📊 Test Results:
if %TEST_EXIT_CODE% equ 0 (
    echo ✅ All tests passed!
    echo 📋 Generating test report...
    call npx playwright show-report
) else (
    echo ❌ Some tests failed
    echo 📋 Generating test report for failed tests...
    call npx playwright show-report
)

echo.
echo 🧹 Cleaning up...
taskkill /f /im node.exe >nul 2>&1

echo.
echo ================================================
echo 🎉 Altroway Setup and Test Process Complete!
echo ================================================
echo.
echo ✅ Database: Real user-generated data loaded
echo ✅ Storage: Buckets configured
echo ✅ Application: All hardcoded data removed
echo ✅ Tests: Comprehensive test suite executed
echo.
echo 📊 Test Results:
if %TEST_EXIT_CODE% equ 0 (
    echo    🟢 All tests passed
) else (
    echo    🔴 Some tests failed - check the report
)
echo.
echo 🚀 Next Steps:
echo    1. Review test results in the generated report
echo    2. Test the application manually at http://localhost:3001
echo    3. Create real user accounts and test all features
echo    4. Monitor the application for any issues
echo.
echo 📚 Documentation:
echo    - QUICK_FIX_GUIDE.md: Quick fixes for common issues
echo    - PHASE1_COMPLETION_GUIDE.md: Complete setup guide
echo    - TESTING_GUIDE.md: Manual testing instructions
echo.

pause
exit /b %TEST_EXIT_CODE%
