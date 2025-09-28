@echo off
REM ===============================================
REM INSTALACIÓN DE TRIGGERS - SISTEMA EDUCATIVO (Windows)
REM ===============================================

echo 🚀 Instalando triggers para el sistema educativo...

REM Variables de configuración (ajusta según tu configuración)
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=DBService
set DB_USER=postgres

echo 🔍 Verificando conexión a la base de datos...

REM Verificar que PostgreSQL esté disponible
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -c "SELECT 1;" > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ No se pudo conectar a la base de datos PostgreSQL
    echo Verifica las variables de configuración en este archivo:
    echo   DB_HOST=%DB_HOST%
    echo   DB_PORT=%DB_PORT%
    echo   DB_NAME=%DB_NAME%
    echo   DB_USER=%DB_USER%
    echo.
    echo Asegúrate de que PostgreSQL esté ejecutándose y las credenciales sean correctas.
    pause
    exit /b 1
)

echo ✅ Conexión a base de datos exitosa

echo 📝 Ejecutando script de triggers...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d %DB_NAME% -f "prisma/sql/triggers.sql"

if %errorlevel% neq 0 (
    echo ❌ Error ejecutando el script de triggers
    pause
    exit /b 1
)

echo.
echo 🎉 ¡Triggers instalados exitosamente!
echo.
echo 📋 Funcionalidades instaladas:
echo   ✅ Auto-actualización de timestamps (updatedAt)
echo   ✅ Auditoría completa de usuarios
echo   ✅ Validación de calificaciones
echo   ✅ Soft delete para usuarios
echo   ✅ Validación de CI y email
echo   ✅ Validación de datos de profesores
echo   ✅ Prevención de asignaciones duplicadas
echo   ✅ Validación de integridad referencial
echo.
echo 📊 Para verificar la instalación ejecuta:
echo   psql -d %DB_NAME% -c "SELECT routine_name FROM information_schema.routines WHERE routine_type='FUNCTION' AND (routine_name LIKE '%%validate%%' OR routine_name LIKE '%%audit%%');"
echo.
pause