-- ==========================================
-- TRIGGERS FOR IMPROVED EDUCATIONAL SYSTEM
-- ==========================================

-- ==================================
-- 1. Trigger to automatically update updatedAt
-- ==================================
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to User table
DROP TRIGGER IF EXISTS user_update_timestamp ON "User";
CREATE TRIGGER user_update_timestamp
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- Apply to Grade_Record table  
DROP TRIGGER IF EXISTS grade_record_update_timestamp ON "Grade_Record";
CREATE TRIGGER grade_record_update_timestamp
    BEFORE UPDATE ON "Grade_Record"
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- ==================================
-- 2. Audit trigger for users
-- ==================================
CREATE TABLE IF NOT EXISTS user_audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_data JSONB,
    new_data JSONB,
    changed_by INTEGER, -- ID of user who made the change (optional)
    changed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET, -- IP of the change (optional)
    user_agent TEXT -- User agent (optional)
);

-- Create indexes to improve audit performance
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
        -- Only log if there are actual changes
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
-- 3. Trigger to validate grades (IMPROVED)
-- ==================================
CREATE OR REPLACE FUNCTION validate_grade_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate that score is not greater than maxScore
    IF NEW.score > NEW."maxScore" THEN
        RAISE EXCEPTION 'Score (%) cannot be greater than maxScore (%). Student ID: %', 
            NEW.score, NEW."maxScore", NEW."studentId";
    END IF;
    
    -- Validate that score is positive
    IF NEW.score < 0 THEN
        RAISE EXCEPTION 'Score cannot be negative: %. Student ID: %', 
            NEW.score, NEW."studentId";
    END IF;
    
    -- Validate that maxScore is positive and reasonable (maximum 1000)
    IF NEW."maxScore" <= 0 OR NEW."maxScore" > 1000 THEN
        RAISE EXCEPTION 'MaxScore must be between 1 and 1000. Current value: %', NEW."maxScore";
    END IF;
    
    -- Validate that academic period is not empty
    IF NEW."academicPeriod" IS NULL OR TRIM(NEW."academicPeriod") = '' THEN
        RAISE EXCEPTION 'Academic period is required';
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
-- 4. Trigger for soft delete (IMPROVED)
-- ==================================
CREATE OR REPLACE FUNCTION soft_delete_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if user is already deactivated
    IF OLD."userStatus" = false THEN
        RAISE NOTICE 'User % is already deactivated', OLD."userId";
        RETURN OLD; -- Allow real DELETE if already deactivated
    END IF;
    
    -- Instead of DELETE, change userStatus to false
    UPDATE "User" 
    SET "userStatus" = false, 
        "updatedAt" = NOW()
    WHERE "userId" = OLD."userId";
    
    -- Log in audit log
    INSERT INTO user_audit_log (user_id, action, old_data, new_data)
    VALUES (OLD."userId", 'SOFT_DEL', to_jsonb(OLD), 
            json_build_object('userStatus', false, 'updatedAt', NOW()));
    
    RETURN NULL; -- Cancel real DELETE
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_soft_delete ON "User";
CREATE TRIGGER user_soft_delete
    BEFORE DELETE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION soft_delete_user();

-- ==================================
-- 5. Additional triggers for educational system
-- ==================================

-- 5.1 Trigger to validate unique CI and format
CREATE OR REPLACE FUNCTION validate_user_ci()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate that CI has between 7 and 9 digits (according to your DTO)
    IF NEW."userCI" < 1000000 OR NEW."userCI" > 999999999 THEN
        RAISE EXCEPTION 'CI must have between 7 and 9 digits. Provided CI: %', NEW."userCI";
    END IF;
    
    -- Validate that email has correct format (additional validation)
    IF NEW."userEmail" !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format: %', NEW."userEmail";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_user_ci_trigger ON "User";
CREATE TRIGGER validate_user_ci_trigger
    BEFORE INSERT OR UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_ci();

-- 5.2 Trigger to validate Teacher data
CREATE OR REPLACE FUNCTION validate_teacher_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate years of experience (0-50 according to your DTO)
    IF NEW."teacherExperienceYears" < 0 OR NEW."teacherExperienceYears" > 50 THEN
        RAISE EXCEPTION 'Years of experience must be between 0 and 50. Value: %', NEW."teacherExperienceYears";
    END IF;
    
    -- Validate weekly hours (1-60 according to your DTO)
    IF NEW."teacherHours" < 1 OR NEW."teacherHours" > 60 THEN
        RAISE EXCEPTION 'Weekly hours must be between 1 and 60. Value: %', NEW."teacherHours";
    END IF;
    
    -- Validate license number format
    IF LENGTH(NEW."teacherLicenseNumber") < 5 THEN
        RAISE EXCEPTION 'License number must have at least 5 characters: %', NEW."teacherLicenseNumber";
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS validate_teacher_data_trigger ON "Teacher";
CREATE TRIGGER validate_teacher_data_trigger
    BEFORE INSERT OR UPDATE ON "Teacher"
    FOR EACH ROW
    EXECUTE FUNCTION validate_teacher_data();

-- 5.3 Trigger to prevent duplicates in relationships
CREATE OR REPLACE FUNCTION prevent_duplicate_assignments()
RETURNS TRIGGER AS $$
BEGIN
    -- For StudentTeacherSubject - prevent duplicate assignments
    IF TG_TABLE_NAME = 'StudentTeacherSubject' THEN
        -- Check that there is no equal active assignment
        IF EXISTS (
            SELECT 1 FROM "StudentTeacherSubject" 
            WHERE "studentId" = NEW."studentId" 
            AND "teacherId" = NEW."teacherId"
            AND "subjectId" = NEW."subjectId" 
            AND "academicPeriod" = NEW."academicPeriod"
            AND "isActive" = true
            AND "studentTeacherSubjectId" != COALESCE(NEW."studentTeacherSubjectId", -1)
        ) THEN
            RAISE EXCEPTION 'An active assignment already exists for this student-teacher-subject in period %', 
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
-- 6. Utility function to clean old audit data
-- ==================================
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete audit logs older than 2 years
    DELETE FROM user_audit_log 
    WHERE changed_at < NOW() - INTERVAL '2 years';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log the cleanup
    RAISE NOTICE 'Deleted % old audit records', deleted_count;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ==================================
-- 7. Trigger to maintain referential integrity
-- ==================================
CREATE OR REPLACE FUNCTION validate_referential_integrity()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate that User exists before creating Student
    IF TG_TABLE_NAME = 'Student' THEN
        IF NOT EXISTS (SELECT 1 FROM "User" WHERE "userId" = NEW."userId" AND "userStatus" = true) THEN
            RAISE EXCEPTION 'User with ID % does not exist or is inactive', NEW."userId";
        END IF;
        
        -- Validate that Grade exists
        IF NOT EXISTS (SELECT 1 FROM "Grade" WHERE "gradeId" = NEW."gradeId" AND "gradeStatus" = true) THEN
            RAISE EXCEPTION 'Grade with ID % does not exist or is inactive', NEW."gradeId";
        END IF;
    END IF;
    
    -- Validate that User exists before creating Teacher
    IF TG_TABLE_NAME = 'Teacher' THEN
        IF NOT EXISTS (SELECT 1 FROM "User" WHERE "userId" = NEW."userId" AND "userStatus" = true) THEN
            RAISE EXCEPTION 'User with ID % does not exist or is inactive', NEW."userId";
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
-- 8. Comments and documentation
-- ==================================
COMMENT ON FUNCTION update_timestamp() IS 'Automatically updates the updatedAt field';
COMMENT ON FUNCTION user_audit_trigger() IS 'Logs changes in User table for auditing';
COMMENT ON FUNCTION validate_grade_score() IS 'Validates that grades are in correct ranges';
COMMENT ON FUNCTION soft_delete_user() IS 'Implements soft delete by changing userStatus to false';
COMMENT ON FUNCTION validate_user_ci() IS 'Validates CI format and user email';
COMMENT ON FUNCTION validate_teacher_data() IS 'Validates specific teacher data';
COMMENT ON FUNCTION prevent_duplicate_assignments() IS 'Prevents duplicate student-teacher-subject assignments';
COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Cleans up audit logs older than 2 years';
COMMENT ON FUNCTION validate_referential_integrity() IS 'Validates referential integrity before inserts/updates';

COMMENT ON TABLE user_audit_log IS 'Audit table for user changes';