import { Migration } from "@mikro-orm/migrations";

export class Migration20250527153644 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user_entity" ("uuid" uuid not null default uuid_generate_v4(), "created_at" timestamp(0) not null default CURRENT_TIMESTAMP, "updated_at" timestamp(0) not null, "username" varchar(255) not null, "password" varchar(255) not null, "roles" text[] not null default '{USER}', "refresh_token" varchar(255) null, constraint "user_entity_pkey" primary key ("uuid"));`
    );
    this.addSql(
      `alter table "user_entity" add constraint "user_entity_username_unique" unique ("username");`
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user_entity" cascade;`);
  }
}
