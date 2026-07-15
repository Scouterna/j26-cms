import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_screen_screens_type" AS ENUM('service', 'kommunikation');
  ALTER TABLE "screen_screens" ADD COLUMN "type" "enum_screen_screens_type" DEFAULT 'service' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_screens" DROP COLUMN "type";
  DROP TYPE "public"."enum_screen_screens_type";`)
}
