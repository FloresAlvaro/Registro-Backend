-- ==========================================
-- TRIGGERS PARA SISTEMA EDUCATIVO MEJORADO
-- ==========================================

-- ==================================
-- 1. Trigger para actualizar updatedAt automáticamente
-- ==================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tabla User
DROP TRIGGER IF EXISTS user_update_timestamp ON "User";
CREATE TRIGGER user_update_timestamp
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Aplicar a tabla Grade_Record  
DROP TRIGGER IF EXISTS grade_record_update_timestamp ON "Grade_Record";
CREATE TRIGGER grade_record_update_timestamp
    BEFORE UPDATE ON "Grade_Record"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ==================================
-- 2. Trigger de auditoría para usuarios
-- ==================================
CREATE TABLE IF NOT EXISTS user_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by INTEGER, -- ID del usuario que hizo el cambio (opcional)
    changed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET, -- IP del cambio (opcional)
    user_agent TEXT -- User agent (opcional)
);

-- Crear índices para mejorar performance en auditoría
CREATE INDEX IF NOT EXISTS idx_user_audit_user_id ON user_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_audit_action ON user_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_user_audit_changed_at ON user_audit_log(changed_at);

CREATE OR REPLACE FUNCTION user_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO user_audit_log (user_id, action, new_data)
        VALUES (NEW."userId", 'INSERT', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Solo registrar si realmente hay cambios
        IF to_jsonb(OLD) IS DISTINCT FROM to_jsonb(NEW) THEN
            INSERT INTO user_audit_log (user_id, action, old_data, new_data)
            VALUES (NEW."userId", 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO user_audit_log (user_id, action, old_data)
        VALUES (OLD."userId", 'DELETE', to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_audit ON "User";
CREATE TRIGGER user_audit
    AFTER INSERT OR UPDATE OR DELETE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION user_audit_trigger();

-- ==================================
-- 3. Trigger para validar calificaciones (MEJORADO)
-- ==================================
CREATE OR REPLACE FUNCTION validate_grade_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que el score no sea mayor al maxScore
    IF NEW.score > NEW."maxScore" THEN
        RAISE EXCEPTION 'El score (%) no puede ser mayor al maxScore (%). Estudiante ID: %', 
            NEW.score, NEW."maxScore", NEW."studentId";
    END IF;
    
    -- Validar que el score sea positivo
    IF NEW.score < 0 THEN
        RAISE EXCEPTION 'El score no puede ser negativo: %. Estudiante ID: %', 
            NEW.score, NEW."studentId";
    END IF;
    
    -- Validar que maxScore sea positivo y razonable (máximo 1000)
    IF NEW."maxScore" <= 0 OR NEW."maxScore" > 1000 THEN
        RAISE EXCEPTION 'El maxScore debe estar entre 1 y 1000. Valor actual: %', NEW."maxScore";
    END IF;
    
    -- Validar que el período académico no esté vacío
    IF NEW."academicPeriod" IS NULL OR TRIM(NEW."academicPeriod") = '' THEN
        RAISE EXCEPTION 'El período académico es obligatorio';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_grade_score_trigger ON "Grade_Record";
CREATE TRIGGER validate_grade_score_trigger
    BEFORE INSERT OR UPDATE ON "Grade_Record"
    FOR EACH ROW
    EXECUTE FUNCTION validate_grade_score();

-- ==================================
-- 4. Trigger para soft delete (MEJORADO)
-- ==================================
CREATE OR REPLACE FUNCTION soft_delete_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el usuario ya está desactivado
    IF OLD."userStatus" = false THEN
        RAISE NOTICE 'Usuario % ya está desactivado', OLD."userId";
        RETURN OLD; -- Permitir DELETE real si ya está desactivado
    END IF;
    
    -- En lugar de DELETE, cambiar userStatus a false
    UPDATE "User" 
    SET "userStatus" = false, 
        "updatedAt" = NOW()
    WHERE "userId" = OLD."userId";
    
    -- Registrar en log de auditoría
    INSERT INTO user_audit_log (user_id, action, old_data, new_data)
    VALUES (OLD."userId", 'SOFT_DEL', to_jsonb(OLD), 
            json_build_object('userStatus', false, 'updatedAt', NOW()));
    
    RETURN NULL; -- Cancela el DELETE real
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_soft_delete ON "User";
CREATE TRIGGER user_soft_delete
    BEFORE DELETE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION soft_delete_user();

-- ==================================
-- 5. Triggers adicionales para sistema educativo
-- ==================================

-- 5.1 Trigger para validar CI único y formato
CREATE OR REPLACE FUNCTION validate_user_ci()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que el CI tenga entre 7 y 9 dígitos (según tu DTO)
    IF NEW."userCI" < 1000000 OR NEW."userCI" > 999999999 THEN
        RAISE EXCEPTION 'El CI debe tener entre 7 y 9 dígitos. CI proporcionado: %', NEW."userCI";
    END IF;
    
    -- Validar que el email tenga formato correcto (validación adicional)
    IF NEW."userEmail" !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Formato de email inválido: %', NEW."userEmail";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_user_ci_trigger ON "User";
CREATE TRIGGER validate_user_ci_trigger
    BEFORE INSERT OR UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_ci();

-- 5.2 Trigger para validar datos del Teacher
CREATE OR REPLACE FUNCTION validate_teacher_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar años de experiencia (0-50 según tu DTO)
    IF NEW."teacherExperienceYears" < 0 OR NEW."teacherExperienceYears" > 50 THEN
        RAISE EXCEPTION 'Los años de experiencia deben estar entre 0 y 50. Valor: %', NEW."teacherExperienceYears";
    END IF;
    
    -- Validar horas semanales (1-60 según tu DTO)
    IF NEW."teacherHours" < 1 OR NEW."teacherHours" > 60 THEN
        RAISE EXCEPTION 'Las horas semanales deben estar entre 1 y 60. Valor: %', NEW."teacherHours";
    END IF;
    
    -- Validar formato del número de licencia
    IF LENGTH(NEW."teacherLicenseNumber") < 5 THEN
        RAISE EXCEPTION 'El número de licencia debe tener al menos 5 caracteres: %', NEW."teacherLicenseNumber";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_teacher_data_trigger ON "Teacher";
CREATE TRIGGER validate_teacher_data_trigger
    BEFORE INSERT OR UPDATE ON "Teacher"
    FOR EACH ROW
    EXECUTE FUNCTION validate_teacher_data();

-- 5.3 Trigger para prevenir duplicados en relaciones
CREATE OR REPLACE FUNCTION prevent_duplicate_assignments()
RETURNS TRIGGER AS $$
BEGIN
    -- Para StudentTeacherSubject - prevenir asignaciones duplicadas
    IF TG_TABLE_NAME = 'StudentTeacherSubject' THEN
        -- Verificar que no existe una asignación activa igual
        IF EXISTS (
            SELECT 1 FROM "StudentTeacherSubject" 
            WHERE "studentId" = NEW."studentId" 
            AND "teacherId" = NEW."teacherId"
            AND "subjectId" = NEW."subjectId" 
            AND "academicPeriod" = NEW."academicPeriod"
            AND "isActive" = true
            AND "studentTeacherSubjectId" != COALESCE(NEW."studentTeacherSubjectId", -1)
        ) THEN
            RAISE EXCEPTION 'Ya existe una asignación activa para este estudiante-profesor-materia en el período %', 
                NEW."academicPeriod";
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_duplicate_assignments_trigger ON "StudentTeacherSubject";
CREATE TRIGGER prevent_duplicate_assignments_trigger
    BEFORE INSERT OR UPDATE ON "StudentTeacherSubject"
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_assignments();

-- ==================================
-- 6. Función utilitaria para limpiar datos de auditoría antiguos
-- ==================================
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Eliminar logs de auditoría mayores a 2 años
    DELETE FROM user_audit_log 
    WHERE changed_at < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log de la limpieza
    RAISE NOTICE 'Eliminados % registros de auditoría antiguos', deleted_count;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==================================
-- 7. Trigger para mantener integridad referencial
-- ==================================
CREATE OR REPLACE FUNCTION validate_referential_integrity()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar que el User existe antes de crear Student
    IF TG_TABLE_NAME = 'Student' THEN
        IF NOT EXISTS (SELECT 1 FROM "User" WHERE "userId" = NEW."userId" AND "userStatus" = true) THEN
            RAISE EXCEPTION 'El usuario con ID % no existe o está inactivo', NEW."userId";
        END IF;
        
        -- Validar que el Grade existe
        IF NOT EXISTS (SELECT 1 FROM "Grade" WHERE "gradeId" = NEW."gradeId" AND "gradeStatus" = true) THEN
            RAISE EXCEPTION 'El grado con ID % no existe o está inactivo', NEW."gradeId";
        END IF;
    END IF;
    
    -- Validar que el User existe antes de crear Teacher
    IF TG_TABLE_NAME = 'Teacher' THEN
        IF NOT EXISTS (SELECT 1 FROM "User" WHERE "userId" = NEW."userId" AND "userStatus" = true) THEN
            RAISE EXCEPTION 'El usuario con ID % no existe o está inactivo', NEW."userId";
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_student_integrity ON "Student";
CREATE TRIGGER validate_student_integrity
    BEFORE INSERT OR UPDATE ON "Student"
    FOR EACH ROW
    EXECUTE FUNCTION validate_referential_integrity();

DROP TRIGGER IF EXISTS validate_teacher_integrity ON "Teacher";  
CREATE TRIGGER validate_teacher_integrity
    BEFORE INSERT OR UPDATE ON "Teacher"
    FOR EACH ROW
    EXECUTE FUNCTION validate_referential_integrity();

-- ==================================
-- 8. Comentarios y documentación
-- ==================================
COMMENT ON FUNCTION update_timestamp() IS 'Actualiza automáticamente el campo updatedAt';
COMMENT ON FUNCTION user_audit_trigger() IS 'Registra cambios en la tabla User para auditoría';
COMMENT ON FUNCTION validate_grade_score() IS 'Valida que las calificaciones estén en rangos correctos';
COMMENT ON FUNCTION soft_delete_user() IS 'Implementa borrado suave cambiando userStatus a false';
COMMENT ON FUNCTION validate_user_ci() IS 'Valida formato de CI y email de usuario';
COMMENT ON FUNCTION validate_teacher_data() IS 'Valida datos específicos de profesores';
COMMENT ON FUNCTION prevent_duplicate_assignments() IS 'Previene asignaciones duplicadas estudiante-profesor-materia';
COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Limpia logs de auditoría mayores a 2 años';
COMMENT ON FUNCTION validate_referential_integrity() IS 'Valida integridad referencial antes de inserts/updates';

COMMENT ON TABLE user_audit_log IS 'Tabla de auditoría para cambios en usuarios';