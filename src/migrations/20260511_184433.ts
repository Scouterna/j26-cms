import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_screen_slides_layout" AS ENUM('two-rows-1-1', 'three-rows-2-1-3', 'voting-map');
  CREATE TABLE "screen_slides_blocks_screen_iframe_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "screen_slides_blocks_screen_rich_text_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "screen_slides_blocks_screen_image_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "screen_slides_blocks_screen_empty_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "screen_slides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"layout" "enum_screen_slides_layout" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "screen_playlists_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slide_id" integer NOT NULL,
  	"duration" numeric DEFAULT 10 NOT NULL
  );
  
  CREATE TABLE "screen_playlists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "screen_screens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"playlist_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "screen_slides_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "screen_playlists_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "screen_screens_id" integer;
  ALTER TABLE "screen_slides_blocks_screen_iframe_content" ADD CONSTRAINT "screen_slides_blocks_screen_iframe_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."screen_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_slides_blocks_screen_rich_text_content" ADD CONSTRAINT "screen_slides_blocks_screen_rich_text_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."screen_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_slides_blocks_screen_image_content" ADD CONSTRAINT "screen_slides_blocks_screen_image_content_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_slides_blocks_screen_image_content" ADD CONSTRAINT "screen_slides_blocks_screen_image_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."screen_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_slides_blocks_screen_empty_content" ADD CONSTRAINT "screen_slides_blocks_screen_empty_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."screen_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_playlists_slides" ADD CONSTRAINT "screen_playlists_slides_slide_id_screen_slides_id_fk" FOREIGN KEY ("slide_id") REFERENCES "public"."screen_slides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "screen_playlists_slides" ADD CONSTRAINT "screen_playlists_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."screen_playlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "screen_screens" ADD CONSTRAINT "screen_screens_playlist_id_screen_playlists_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."screen_playlists"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "screen_slides_blocks_screen_iframe_content_order_idx" ON "screen_slides_blocks_screen_iframe_content" USING btree ("_order");
  CREATE INDEX "screen_slides_blocks_screen_iframe_content_parent_id_idx" ON "screen_slides_blocks_screen_iframe_content" USING btree ("_parent_id");
  CREATE INDEX "screen_slides_blocks_screen_iframe_content_path_idx" ON "screen_slides_blocks_screen_iframe_content" USING btree ("_path");
  CREATE INDEX "screen_slides_blocks_screen_rich_text_content_order_idx" ON "screen_slides_blocks_screen_rich_text_content" USING btree ("_order");
  CREATE INDEX "screen_slides_blocks_screen_rich_text_content_parent_id_idx" ON "screen_slides_blocks_screen_rich_text_content" USING btree ("_parent_id");
  CREATE INDEX "screen_slides_blocks_screen_rich_text_content_path_idx" ON "screen_slides_blocks_screen_rich_text_content" USING btree ("_path");
  CREATE INDEX "screen_slides_blocks_screen_image_content_order_idx" ON "screen_slides_blocks_screen_image_content" USING btree ("_order");
  CREATE INDEX "screen_slides_blocks_screen_image_content_parent_id_idx" ON "screen_slides_blocks_screen_image_content" USING btree ("_parent_id");
  CREATE INDEX "screen_slides_blocks_screen_image_content_path_idx" ON "screen_slides_blocks_screen_image_content" USING btree ("_path");
  CREATE INDEX "screen_slides_blocks_screen_image_content_image_idx" ON "screen_slides_blocks_screen_image_content" USING btree ("image_id");
  CREATE INDEX "screen_slides_blocks_screen_empty_content_order_idx" ON "screen_slides_blocks_screen_empty_content" USING btree ("_order");
  CREATE INDEX "screen_slides_blocks_screen_empty_content_parent_id_idx" ON "screen_slides_blocks_screen_empty_content" USING btree ("_parent_id");
  CREATE INDEX "screen_slides_blocks_screen_empty_content_path_idx" ON "screen_slides_blocks_screen_empty_content" USING btree ("_path");
  CREATE INDEX "screen_slides_updated_at_idx" ON "screen_slides" USING btree ("updated_at");
  CREATE INDEX "screen_slides_created_at_idx" ON "screen_slides" USING btree ("created_at");
  CREATE INDEX "screen_playlists_slides_order_idx" ON "screen_playlists_slides" USING btree ("_order");
  CREATE INDEX "screen_playlists_slides_parent_id_idx" ON "screen_playlists_slides" USING btree ("_parent_id");
  CREATE INDEX "screen_playlists_slides_slide_idx" ON "screen_playlists_slides" USING btree ("slide_id");
  CREATE INDEX "screen_playlists_updated_at_idx" ON "screen_playlists" USING btree ("updated_at");
  CREATE INDEX "screen_playlists_created_at_idx" ON "screen_playlists" USING btree ("created_at");
  CREATE INDEX "screen_screens_playlist_idx" ON "screen_screens" USING btree ("playlist_id");
  CREATE INDEX "screen_screens_updated_at_idx" ON "screen_screens" USING btree ("updated_at");
  CREATE INDEX "screen_screens_created_at_idx" ON "screen_screens" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_screen_slides_fk" FOREIGN KEY ("screen_slides_id") REFERENCES "public"."screen_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_screen_playlists_fk" FOREIGN KEY ("screen_playlists_id") REFERENCES "public"."screen_playlists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_screen_screens_fk" FOREIGN KEY ("screen_screens_id") REFERENCES "public"."screen_screens"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_screen_slides_id_idx" ON "payload_locked_documents_rels" USING btree ("screen_slides_id");
  CREATE INDEX "payload_locked_documents_rels_screen_playlists_id_idx" ON "payload_locked_documents_rels" USING btree ("screen_playlists_id");
  CREATE INDEX "payload_locked_documents_rels_screen_screens_id_idx" ON "payload_locked_documents_rels" USING btree ("screen_screens_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "screen_slides_blocks_screen_iframe_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_slides_blocks_screen_rich_text_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_slides_blocks_screen_image_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_slides_blocks_screen_empty_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_playlists_slides" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_playlists" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "screen_screens" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "screen_slides_blocks_screen_iframe_content" CASCADE;
  DROP TABLE "screen_slides_blocks_screen_rich_text_content" CASCADE;
  DROP TABLE "screen_slides_blocks_screen_image_content" CASCADE;
  DROP TABLE "screen_slides_blocks_screen_empty_content" CASCADE;
  DROP TABLE "screen_slides" CASCADE;
  DROP TABLE "screen_playlists_slides" CASCADE;
  DROP TABLE "screen_playlists" CASCADE;
  DROP TABLE "screen_screens" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_screen_slides_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_screen_playlists_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_screen_screens_fk";
  
  DROP INDEX "payload_locked_documents_rels_screen_slides_id_idx";
  DROP INDEX "payload_locked_documents_rels_screen_playlists_id_idx";
  DROP INDEX "payload_locked_documents_rels_screen_screens_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "screen_slides_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "screen_playlists_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "screen_screens_id";
  DROP TYPE "public"."enum_screen_slides_layout";`)
}
