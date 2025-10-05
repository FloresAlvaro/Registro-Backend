import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseSetupService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Execute triggers only in development/first time
    if (process.env.NODE_ENV === 'development') {
      await this.setupTriggers();
    }
  }

  private async setupTriggers() {
    try {
      const triggersPath = path.join(__dirname, '../../sql/triggers.sql');
      const triggersSQL = fs.readFileSync(triggersPath, 'utf8');

      // Execute each statement separately
      const statements = triggersSQL
        .split(';')
        .filter((stmt) => stmt.trim().length > 0);

      for (const statement of statements) {
        if (statement.trim()) {
          await this.prisma.$executeRawUnsafe(statement + ';');
        }
      }

      console.log('✅ Triggers created successfully');
    } catch (error) {
      console.error('❌ Error creating triggers:', error);
    }
  }

  // Methods for specific triggers
  async createUserAuditTrigger() {
    await this.prisma.$executeRaw`
      CREATE OR REPLACE FUNCTION user_audit_trigger()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'UPDATE' THEN
          INSERT INTO user_audit_log (user_id, action, old_data, new_data)
          VALUES (NEW."userId", 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
  }

  async dropAllTriggers() {
    await this.prisma.$executeRaw`
      DROP TRIGGER IF EXISTS user_update_timestamp ON "User";
      DROP TRIGGER IF EXISTS grade_record_update_timestamp ON "Grade_Record";
      DROP TRIGGER IF EXISTS user_audit ON "User";
      DROP TRIGGER IF EXISTS validate_grade_score_trigger ON "Grade_Record";
      DROP TRIGGER IF EXISTS user_soft_delete ON "User";
      
      DROP FUNCTION IF EXISTS update_timestamp();
      DROP FUNCTION IF EXISTS user_audit_trigger();
      DROP FUNCTION IF EXISTS validate_grade_score();
      DROP FUNCTION IF EXISTS soft_delete_user();
    `;
    console.log('🗑️ All triggers removed');
  }
}
