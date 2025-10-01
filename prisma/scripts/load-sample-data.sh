#!/bin/bash

# ===============================================
# CARGAR DATOS DE PRUEBA - SISTEMA EDUCATIVO
# ===============================================

echo "🚀 Cargando datos de prueba al sistema educativo..."

# Variables de configuración
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-"DBService"}
DB_USER=${DB_USER:-"admin"}
export PGPASSWORD=${PGPASSWORD:-"password"}

echo "🔍 Verificando conexión a la base de datos..."

if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "❌ No se pudo conectar a la base de datos PostgreSQL"
    echo "Verifica las variables de entorno:"
    echo "  DB_HOST=$DB_HOST"
    echo "  DB_PORT=$DB_PORT" 
    echo "  DB_NAME=$DB_NAME"
    echo "  DB_USER=$DB_USER"
    exit 1
fi

echo "✅ Conexión a base de datos exitosa"

echo "📝 Cargando datos de prueba..."
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "prisma/sql/sample-data.sql"; then
    echo "✅ Datos cargados exitosamente"
else
    echo "❌ Error cargando los datos de prueba"
    exit 1
fi

echo ""
echo "🎉 ¡Datos de prueba cargados exitosamente!"
echo ""
echo "📊 Datos creados:"
echo "  ✅ 5 Roles del sistema"
echo "  ✅ 11 Grados académicos (Primaria y Secundaria)"
echo "  ✅ 15 Materias/Asignaturas"
echo "  ✅ 18 Usuarios (2 admin, 6 profesores, 10 estudiantes)"
echo "  ✅ 6 Registros de profesores"
echo "  ✅ 10 Registros de estudiantes"
echo "  ✅ Relaciones profesor-grado y grado-materia"
echo "  ✅ Asignaciones estudiante-profesor-materia"
echo "  ✅ Calificaciones de ejemplo"
echo ""
echo "🌐 Puedes verificar los datos en Prisma Studio:"
echo "  npx prisma studio"
echo ""
echo "👥 Usuarios de prueba creados:"
echo "  📧 admin@colegio.edu.pe (Administrador)"
echo "  📧 director@colegio.edu.pe (Director)"
echo "  📧 jmendoza@colegio.edu.pe (Profesor - Matemática)"
echo "  📧 diego.perez@estudiante.edu.pe (Estudiante)"
echo ""