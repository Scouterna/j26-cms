import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_slides" ALTER COLUMN "layout" SET DATA TYPE text;

  -- Remap old layout slugs to the new ones while the column is plain text.
  UPDATE "screen_slides" SET "layout" = 'kom_single'   WHERE "layout" = 'one-row-1';
  UPDATE "screen_slides" SET "layout" = 'kom_two_rows' WHERE "layout" = 'two-rows-1-1';
  UPDATE "screen_slides" SET "layout" = 'kom_gallery'  WHERE "layout" = 'three-rows-2-1-3';
  UPDATE "screen_slides" SET "layout" = 'kom_vote_single' WHERE "layout" = 'voting-map';
  UPDATE "screen_slides" SET "layout" = 'ser_info'     WHERE "layout" IN ('news-banner-1', 'news-weather-1');

  DROP TYPE "public"."enum_screen_slides_layout";
  CREATE TYPE "public"."enum_screen_slides_layout" AS ENUM('kom_single', 'kom_two_rows', 'kom_gallery', 'kom_vote_single', 'kom_vote_gallery', 'ser_info');
  ALTER TABLE "screen_slides" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_screen_slides_layout" USING "layout"::"public"."enum_screen_slides_layout";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_slides" ALTER COLUMN "layout" SET DATA TYPE text;

  -- Remap new layout slugs back to the old ones (voting variants both collapse to voting-map).
  UPDATE "screen_slides" SET "layout" = 'one-row-1'        WHERE "layout" = 'kom_single';
  UPDATE "screen_slides" SET "layout" = 'two-rows-1-1'     WHERE "layout" = 'kom_two_rows';
  UPDATE "screen_slides" SET "layout" = 'three-rows-2-1-3' WHERE "layout" = 'kom_gallery';
  UPDATE "screen_slides" SET "layout" = 'voting-map'       WHERE "layout" IN ('kom_vote_single', 'kom_vote_gallery');
  UPDATE "screen_slides" SET "layout" = 'news-banner-1'    WHERE "layout" = 'ser_info';

  DROP TYPE "public"."enum_screen_slides_layout";
  CREATE TYPE "public"."enum_screen_slides_layout" AS ENUM('one-row-1', 'two-rows-1-1', 'three-rows-2-1-3', 'voting-map', 'news-banner-1', 'news-weather-1');
  ALTER TABLE "screen_slides" ALTER COLUMN "layout" SET DATA TYPE "public"."enum_screen_slides_layout" USING "layout"::"public"."enum_screen_slides_layout";`)
}
