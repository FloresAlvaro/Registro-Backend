#!/bin/bash

# ===============================================
# TRIGGERS INSTALLATION - EDUCATIONAL SYSTEM
# ===============================================

echo "🚀 Installing triggers for the educational system..."

# Configuration variables
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-"DBService"}
DB_USER=${DB_USER:-"admin"}
export PGPASSWORD=${PGPASSWORD:-"password"}

# Function to execute SQL with error handling
execute_sql() {
    echo "📝 Executing: $1"
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$1"; then
        echo "✅ $1 executed successfully"
    else
        echo "❌ Error executing $1"
        exit 1
    fi
}

# Verify that PostgreSQL is available
echo "🔍 Verifying database connection..."
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ Could not connect to PostgreSQL database"
    echo "Verify the environment variables:"
    echo "  DB_HOST=$DB_HOST"
    echo "  DB_PORT=$DB_PORT" 
    echo "  DB_NAME=$DB_NAME"
    echo "  DB_USER=$DB_USER"
    echo "  PGPASSWORD=****** (configured)"
    exit 1
fi

echo "✅ Database connection successful"

# Execute the triggers script
execute_sql "prisma/sql/triggers.sql"

echo ""
echo "🎉 Triggers successfully installed!"
echo ""
echo "📋 Installed functionalities:"
echo "  ✅ Auto-update timestamps (updatedAt)"
echo "  ✅ Complete user auditing"
echo "  ✅ Grade validation"
echo "  ✅ Soft delete for users"
echo "  ✅ CI and email validation"
echo "  ✅ Teacher data validation"
echo "  ✅ Duplicate assignment prevention"
echo "  ✅ Referential integrity validation"
echo ""
echo "📊 To verify installation:"
echo "  psql -d $DB_NAME -c \"SELECT routine_name FROM information_schema.routines WHERE routine_type='FUNCTION' AND routine_name LIKE '%validate%' OR routine_name LIKE '%audit%';\""
echo ""