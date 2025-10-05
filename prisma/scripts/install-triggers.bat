@echo off
REM ===============================================
REM TRIGGERS INSTALLATION - EDUCATIONAL SYSTEM (Windows)
REM ===============================================

echo 🚀 Installing triggers for the educational system...

REM Configuration variables (adjust according to your setup)
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=DBService
set DB_USER=admin
set PGPASSWORD=password

echo 🔍 Verifying database connection...

REM Verify that PostgreSQL is available
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 1;" > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Could not connect to PostgreSQL database
    echo Verify the configuration variables in this file:
    echo   DB_HOST=%DB_HOST%
    echo   DB_PORT=%DB_PORT%
    echo   DB_NAME=%DB_NAME%
    echo   DB_USER=%DB_USER%
    echo   PGPASSWORD=****** (configured)
    echo.
    echo Make sure PostgreSQL is running and credentials are correct.
    pause
    exit /b 1
)

echo ✅ Database connection successful

echo 📝 Executing triggers script...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "prisma/sql/triggers.sql"

if %errorlevel% neq 0 (
    echo ❌ Error executing triggers script
    pause
    exit /b 1
)

echo.
echo 🎉 Triggers successfully installed!
echo.
echo 📋 Installed functionalities:
echo   ✅ Auto-update timestamps (updatedAt)
echo   ✅ Complete user auditing
echo   ✅ Grade validation
echo   ✅ Soft delete for users
echo   ✅ CI and email validation
echo   ✅ Teacher data validation
echo   ✅ Duplicate assignment prevention
echo   ✅ Referential integrity validation
echo.
echo 📊 To verify installation run:
echo   psql -d %DB_NAME% -c "SELECT routine_name FROM information_schema.routines WHERE routine_type='FUNCTION' AND (routine_name LIKE '%%validate%%' OR routine_name LIKE '%%audit%%');"
echo.
pause