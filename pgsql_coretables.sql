SET TIME ZONE 'UTC';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" text UNIQUE NOT NULL,
  "username" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "first_name" text,
  "last_name" text,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "groups" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "headline" text,
  "description" text,
  "public" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "equipment" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text NOT NULL,
  "category_id" uuid NOT NULL,
  "headline" text,
  "description" text,
  "public" boolean DEFAULT false,
  "configuration" json NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "rooms" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text NOT NULL,
  "category_id" uuid NOT NULL,
  "headline" text,
  "description" text,
  "public" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "usertypes" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "siteroles" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "sitepermissions" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "grouproles" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "group_id" uuid,
  "name" text NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "grouppermissions" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "equipment_categories" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "room_categories" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "user_usertype" (
  "user_id" uuid,
  "usertype_id" uuid
);

CREATE TABLE "user_groups" (
  "user_id" uuid,
  "group_id" uuid
);

CREATE TABLE "user_equipment" (
  "user_id" uuid,
  "equip_id" uuid
);

CREATE TABLE "user_rooms" (
  "user_id" uuid,
  "room_id" uuid
);

CREATE TABLE "user_siteroles" (
  "user_id" uuid,
  "siterole_id" uuid
);

CREATE TABLE "siterole_sitepermissions" (
  "siterole_id" uuid,
  "sitepermission_id" uuid
);

CREATE TABLE "grouproles_grouppermissions" (
  "grouprole_id" uuid,
  "grouppermission_id" uuid
);

CREATE TABLE "user_grouproles" (
  "user_id" uuid,
  "grouprole_id" uuid
);

CREATE TABLE "group_equipment" (
  "group_id" uuid,
  "equip_id" uuid
);

CREATE TABLE "group_rooms" (
  "group_id" uuid,
  "room_id" uuid
);

CREATE TABLE "room_equipment" (
  "room_id" uuid,
  "equip_id" uuid
);

CREATE TABLE "room_chat_log" (
  "room_id" uuid,
  "user_id" uuid,
  "message_contents" text,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "group_chat_threads" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "group_id" uuid,
  "name" text NOT NULL,
  "headline" text,
  "description" text,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "group_chat_log" (
  "group_id" uuid,
  "thread_id" uuid,
  "user_id" uuid,
  "message_contents" text,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE "equipment" ADD FOREIGN KEY ("category_id") REFERENCES "equipment_categories" ("id") ON DELETE NO ACTION;

ALTER TABLE "rooms" ADD FOREIGN KEY ("category_id") REFERENCES "room_categories" ("id") ON DELETE NO ACTION;

ALTER TABLE "grouproles" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_usertype" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_usertype" ADD FOREIGN KEY ("usertype_id") REFERENCES "usertypes" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_groups" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_groups" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_equipment" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_equipment" ADD FOREIGN KEY ("equip_id") REFERENCES "equipment" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_siteroles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_siteroles" ADD FOREIGN KEY ("siterole_id") REFERENCES "siteroles" ("id") ON DELETE NO ACTION;

ALTER TABLE "siterole_sitepermissions" ADD FOREIGN KEY ("siterole_id") REFERENCES "siteroles" ("id") ON DELETE NO ACTION;

ALTER TABLE "siterole_sitepermissions" ADD FOREIGN KEY ("sitepermission_id") REFERENCES "sitepermissions" ("id") ON DELETE NO ACTION;

ALTER TABLE "grouproles_grouppermissions" ADD FOREIGN KEY ("grouprole_id") REFERENCES "grouproles" ("id") ON DELETE NO ACTION;

ALTER TABLE "grouproles_grouppermissions" ADD FOREIGN KEY ("grouppermission_id") REFERENCES "grouppermissions" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_grouproles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_grouproles" ADD FOREIGN KEY ("grouprole_id") REFERENCES "grouproles" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_equipment" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_equipment" ADD FOREIGN KEY ("equip_id") REFERENCES "equipment" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_rooms" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_equipment" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_equipment" ADD FOREIGN KEY ("equip_id") REFERENCES "equipment" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_chat_log" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_chat_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_threads" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("thread_id") REFERENCES "group_chat_threads" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION;
