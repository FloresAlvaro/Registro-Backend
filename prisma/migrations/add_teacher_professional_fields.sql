-- Migration to add teacher professional fields
-- Adds experience years, license number, and weekly hours to Teacher table

BEGIN;

-- Add new columns to Teacher table
ALTER TABLE "Teacher" ADD COLUMN "teacherExperienceYears" INTEGER;
ALTER TABLE "Teacher" ADD COLUMN "teacherLicenseNumber" VARCHAR(50);
ALTER TABLE "Teacher" ADD COLUMN "teacherHours" INTEGER;

-- Create unique index for license number (professional requirement)
CREATE UNIQUE INDEX "teacher_license_index" ON "Teacher"("teacherLicenseNumber");

-- Add unique constraint for license number
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_teacherLicenseNumber_key" UNIQUE ("teacherLicenseNumber");

-- Add check constraints for valid ranges
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_teacherExperienceYears_check" 
    CHECK ("teacherExperienceYears" >= 0 AND "teacherExperienceYears" <= 50);

ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_teacherHours_check" 
    CHECK ("teacherHours" >= 1 AND "teacherHours" <= 60);

COMMIT;

-- Note: After running this migration, you'll need to populate the new fields
-- for existing teachers before making them NOT NULL in production.
-- 
-- Example update script (run separately after populating data):
-- ALTER TABLE "Teacher" ALTER COLUMN "teacherExperienceYears" SET NOT NULL;
-- ALTER TABLE "Teacher" ALTER COLUMN "teacherLicenseNumber" SET NOT NULL;
-- ALTER TABLE "Teacher" ALTER COLUMN "teacherHours" SET NOT NULL;