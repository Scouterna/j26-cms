import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_info_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__info_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__info_page_v_published_locale" AS ENUM('sv', 'en');
  CREATE TABLE "_info_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_icon" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__info_page_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__info_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_info_page_v_locales" (
  	"version_title" varchar,
  	"version_content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "info_page_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "info_page_locales" ALTER COLUMN "content" DROP NOT NULL;
  ALTER TABLE "info_page" ADD COLUMN "_status" "enum_info_page_status" DEFAULT 'draft';
  ALTER TABLE "_info_page_v" ADD CONSTRAINT "_info_page_v_parent_id_info_page_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."info_page"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_info_page_v_locales" ADD CONSTRAINT "_info_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_info_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_info_page_v_parent_idx" ON "_info_page_v" USING btree ("parent_id");
  CREATE INDEX "_info_page_v_version_version_updated_at_idx" ON "_info_page_v" USING btree ("version_updated_at");
  CREATE INDEX "_info_page_v_version_version_created_at_idx" ON "_info_page_v" USING btree ("version_created_at");
  CREATE INDEX "_info_page_v_version_version__status_idx" ON "_info_page_v" USING btree ("version__status");
  CREATE INDEX "_info_page_v_created_at_idx" ON "_info_page_v" USING btree ("created_at");
  CREATE INDEX "_info_page_v_updated_at_idx" ON "_info_page_v" USING btree ("updated_at");
  CREATE INDEX "_info_page_v_snapshot_idx" ON "_info_page_v" USING btree ("snapshot");
  CREATE INDEX "_info_page_v_published_locale_idx" ON "_info_page_v" USING btree ("published_locale");
  CREATE INDEX "_info_page_v_latest_idx" ON "_info_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_info_page_v_locales_locale_parent_id_unique" ON "_info_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "info_page__status_idx" ON "info_page" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_info_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_info_page_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_info_page_v" CASCADE;
  DROP TABLE "_info_page_v_locales" CASCADE;
  DROP INDEX "info_page__status_idx";
  ALTER TABLE "info_page_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "info_page_locales" ALTER COLUMN "content" SET NOT NULL;
  ALTER TABLE "info_page" DROP COLUMN "_status";
  DROP TYPE "public"."enum_info_page_status";
  DROP TYPE "public"."enum__info_page_v_version_status";
  DROP TYPE "public"."enum__info_page_v_published_locale";`)
}
