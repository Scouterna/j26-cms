import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "important_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT false,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "screen_playlists" ADD COLUMN "rolling_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "important_info" CASCADE;
  ALTER TABLE "screen_playlists" DROP COLUMN "rolling_text";`)
}
