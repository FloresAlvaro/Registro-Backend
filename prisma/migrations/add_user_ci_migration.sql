-- Migration to add userCI column to User table
-- This adds the Cédula de Identidad field as a unique identifier

BEGIN;

-- Add the userCI column as NOT NULL with a temporary default value
ALTER TABLE "User" ADD COLUMN "userCI" INTEGER;

-- Create a unique index for performance
CREATE UNIQUE INDEX "user_userci_index" ON "User"("userCI");

-- Add constraint to make it unique
ALTER TABLE "User" ADD CONSTRAINT "User_userCI_key" UNIQUE ("userCI");

COMMIT;

-- Note: After running this migration, you'll need to manually populate the userCI values
-- for existing users before making the column NOT NULL in production.
-- 
-- Example update script (run separately):
-- UPDATE "User" SET "userCI" = userId + 10000000 WHERE "userCI" IS NULL;
-- ALTER TABLE "User" ALTER COLUMN "userCI" SET NOT NULL;