import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_screen_slides_layout" ADD VALUE 'one-row-1' BEFORE 'two-rows-1-1';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_slides" ALTER COLUMN "layout" SET DATA TYPE text;
  DROP TYPE "public"."enum_screen_slides_layout";
  CREATE TYPE "public"."enum_screen_slides_layout" AS ENUM('two-rows-1-1', 'three-rows-2-1-3', 'voting-map', 'news-banner-1', 'news-weather-1');
  ALTER TABLE "screen_slides" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_screen_slides_layout" USING "layout"::"public"."enum_screen_slides_layout";`)
}
