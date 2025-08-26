@echo off
echo ========================================
echo    Altroway Environment Setup Script
echo ========================================
echo.

echo This script will help you create the .env.local file
echo with the required environment variables.
echo.

echo Please make sure you have your Supabase credentials ready:
echo - Supabase URL
echo - Supabase Anon Key  
echo - Supabase Service Role Key
echo - Groq API Key (optional)
echo.

set /p SUPABASE_URL="Enter your Supabase URL (e.g., https://yswyapjqdtvydhvycfii.supabase.co): "
set /p SUPABASE_ANON_KEY="Enter your Supabase Anon Key: "
set /p SUPABASE_SERVICE_ROLE_KEY="Enter your Supabase Service Role Key: "
set /p GROQ_API_KEY="Enter your Groq API Key (optional, press Enter to skip): "

echo.
echo Creating .env.local file...

(
echo # Supabase Configuration
echo NEXT_PUBLIC_SUPABASE_URL=%SUPABASE_URL%
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=%SUPABASE_ANON_KEY%
echo SUPABASE_SERVICE_ROLE_KEY=%SUPABASE_SERVICE_ROLE_KEY%
echo.
echo # Application Configuration
echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
echo.
echo # AI Configuration ^(for chat functionality^)
if not "%GROQ_API_KEY%"=="" echo GROQ_API_KEY=%GROQ_API_KEY%
) > .env.local

echo.
echo ✅ .env.local file created successfully!
echo.
echo Next steps:
echo 1. Apply the database migration from SUPABASE_MCP_SETUP_GUIDE.md
echo 2. Set up storage buckets in Supabase Dashboard
echo 3. Run 'npm run dev' to start the development server
echo.
echo Press any key to exit...
pause > nul
