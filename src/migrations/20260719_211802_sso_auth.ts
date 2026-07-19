import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  DROP INDEX "users_email_idx";
  ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
  ALTER TABLE "users" ADD COLUMN "sub" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX "users_sub_idx" ON "users" USING btree ("sub");
  ALTER TABLE "users" DROP COLUMN "reset_password_token";
  ALTER TABLE "users" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "users" DROP COLUMN "salt";
  ALTER TABLE "users" DROP COLUMN "hash";
  ALTER TABLE "users" DROP COLUMN "login_attempts";
  ALTER TABLE "users" DROP COLUMN "lock_until";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "users_roles" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_roles" CASCADE;
  DROP INDEX "users_sub_idx";
  ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
  ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "salt" varchar;
  ALTER TABLE "users" ADD COLUMN "hash" varchar;
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  ALTER TABLE "users" DROP COLUMN "sub";
  ALTER TABLE "users" DROP COLUMN "name";
  DROP TYPE "public"."enum_users_roles";`)
}
