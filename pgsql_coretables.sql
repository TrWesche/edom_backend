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

CREATE TABLE "devices" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text NOT NULL,
  "category" text NOT NULL,
  "sub_category" text,
  "headline" text,
  "description" text,
  "configuration" json NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "rooms" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text NOT NULL,
  "category" text NOT NULL,
  "sub_category" text,
  "headline" text,
  "description" text,
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
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "grouppermissions" (
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

CREATE TABLE "user_devices" (
  "user_id" uuid,
  "device_id" uuid
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
  "sitepermissions" uuid
);

CREATE TABLE "grouproles_grouppermissions" (
  "grouprole_id" uuid,
  "grouppermission_id" uuid
);

CREATE TABLE "user_grouproles" (
  "user_id" uuid,
  "grouprole_id" uuid
);

CREATE TABLE "group_devices" (
  "group_id" uuid,
  "device_id" uuid
);

CREATE TABLE "group_rooms" (
  "group_id" uuid,
  "room_id" uuid
);

CREATE TABLE "room_devices" (
  "room_id" uuid,
  "device_id" uuid
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

ALTER TABLE "grouproles" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "user_usertype" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_usertype" ADD FOREIGN KEY ("usertype_id") REFERENCES "usertypes" ("id");

ALTER TABLE "user_groups" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_groups" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "user_devices" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_devices" ADD FOREIGN KEY ("device_id") REFERENCES "devices" ("id");

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "user_siteroles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_siteroles" ADD FOREIGN KEY ("siterole_id") REFERENCES "siteroles" ("id");

ALTER TABLE "siterole_sitepermissions" ADD FOREIGN KEY ("siterole_id") REFERENCES "siteroles" ("id");

ALTER TABLE "siterole_sitepermissions" ADD FOREIGN KEY ("sitepermissions") REFERENCES "sitepermissions" ("id");

ALTER TABLE "grouproles_grouppermissions" ADD FOREIGN KEY ("grouprole_id") REFERENCES "grouproles" ("id");

ALTER TABLE "grouproles_grouppermissions" ADD FOREIGN KEY ("grouppermission_id") REFERENCES "grouppermissions" ("id");

ALTER TABLE "user_grouproles" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "user_grouproles" ADD FOREIGN KEY ("grouprole_id") REFERENCES "grouproles" ("id");

ALTER TABLE "group_devices" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "group_devices" ADD FOREIGN KEY ("device_id") REFERENCES "devices" ("id");

ALTER TABLE "group_rooms" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "group_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "room_devices" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "room_devices" ADD FOREIGN KEY ("device_id") REFERENCES "devices" ("id");

ALTER TABLE "room_chat_log" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "room_chat_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "group_chat_threads" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("thread_id") REFERENCES "group_chat_threads" ("id");

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
