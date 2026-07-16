import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_screen_slides_type" AS ENUM('service', 'kommunikation');
  CREATE TYPE "public"."enum_screen_playlists_type" AS ENUM('service', 'kommunikation');
  ALTER TABLE "screen_slides" ADD COLUMN "type" "enum_screen_slides_type" DEFAULT 'service' NOT NULL;
  ALTER TABLE "screen_playlists" ADD COLUMN "type" "enum_screen_playlists_type" DEFAULT 'service' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_slides" DROP COLUMN "type";
  ALTER TABLE "screen_playlists" DROP COLUMN "type";
  DROP TYPE "public"."enum_screen_slides_type";
  DROP TYPE "public"."enum_screen_playlists_type";`)
}
