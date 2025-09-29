#!/bin/bash

# ===============================================
# INSTALACIÓN DE TRIGGERS - SISTEMA EDUCATIVO
# ===============================================

echo "🚀 Instalando triggers para el sistema educativo..."

# Variables de configuración
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-"DBService"}
DB_USER=${DB_USER:-"admin"}
export PGPASSWORD=${PGPASSWORD:-"password"}

# Función para ejecutar SQL con manejo de errores
execute_sql() {
    echo "📝 Ejecutando: $1"
    if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$1"; then
        echo "✅ $1 ejecutado exitosamente"
    else
        echo "❌ Error ejecutando $1"
        exit 1
    fi
}

# Verificar que PostgreSQL esté disponible
echo "🔍 Verificando conexión a la base de datos..."
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ No se pudo conectar a la base de datos PostgreSQL"
    echo "Verifica las variables de entorno:"
    echo "  DB_HOST=$DB_HOST"
    echo "  DB_PORT=$DB_PORT" 
    echo "  DB_NAME=$DB_NAME"
    echo "  DB_USER=$DB_USER"
    echo "  PGPASSWORD=****** (configurada)"
    exit 1
fi

echo "✅ Conexión a base de datos exitosa"

# Ejecutar el script de triggers
execute_sql "prisma/sql/triggers.sql"

echo ""
echo "🎉 ¡Triggers instalados exitosamente!"
echo ""
echo "📋 Funcionalidades instaladas:"
echo "  ✅ Auto-actualización de timestamps (updatedAt)"
echo "  ✅ Auditoría completa de usuarios"
echo "  ✅ Validación de calificaciones"
echo "  ✅ Soft delete para usuarios"
echo "  ✅ Validación de CI y email"
echo "  ✅ Validación de datos de profesores"
echo "  ✅ Prevención de asignaciones duplicadas"
echo "  ✅ Validación de integridad referencial"
echo ""
echo "📊 Para verificar la instalación:"
echo "  psql -d $DB_NAME -c \"SELECT routine_name FROM information_schema.routines WHERE routine_type='FUNCTION' AND routine_name LIKE '%validate%' OR routine_name LIKE '%audit%';\""
echo ""