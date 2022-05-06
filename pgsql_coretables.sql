SET TIME ZONE 'UTC';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "useraccount" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "password" text NOT NULL,
  "account_status" text DEFAULT 'active',
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "userdata" (
  "user_id" uuid NOT NULL,
  "email" text UNIQUE NOT NULL,
  "email_clean" text UNIQUE NOT NULL,
  "public_email" boolean DEFAULT false,
  "first_name" text,
  "public_first_name" boolean DEFAULT false,
  "last_name" text,
  "public_last_name" boolean DEFAULT false,
  "location" text,
  "public_location" boolean DEFAULT false
);

CREATE TABLE "userprofile" (
  "user_id" uuid NOT NULL,
  "username" text UNIQUE NOT NULL,
  "username_clean" text UNIQUE NOT NULL,
  "headline" text,
  "about" text,
  "image_url" text,
  "image_alt_text" text,
  "public" boolean DEFAULT false
);

CREATE TABLE "subscriptiontypes" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "definition" json NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "user_subscription" (
  "user_id" uuid NOT NULL,
  "subscription_id" uuid NOT NULL
);

CREATE TABLE "sitegroups" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "name_clean" text UNIQUE NOT NULL,
  "headline" text,
  "description" text,
  "image_url" text,
  "image_alt_text" text,
  "location" text,
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
  "image_url" text,
  "image_alt_text" text,
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
  "image_url" text,
  "image_alt_text" text,
  "public" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "siteroles" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
  "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE "permissiontypes" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" text UNIQUE NOT NULL,
  "category" text NOT NULL,
  "module" text NOT NULL,
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

-- CREATE TABLE "grouppermissions" (
--   "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
--   "name" text UNIQUE NOT NULL,
--   "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP),
--   "modified_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
-- );

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

CREATE TABLE "siterole_permissiontypes" (
  "siterole_id" uuid,
  "permission_id" uuid
);

CREATE TABLE "grouproles_permissiontypes" (
  "grouprole_id" uuid,
  "permission_id" uuid
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

CREATE TABLE "group_membership_requests" (
  "group_id" uuid,
  "user_id" uuid,
  "group_request" boolean,
  "user_request" boolean,
  "message" text,
  "created_at" timestamptz DEFAULT (CURRENT_TIMESTAMP)
);


ALTER TABLE "group_membership_requests" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_membership_requests" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "userdata" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "userprofile" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "equipment" ADD FOREIGN KEY ("category_id") REFERENCES "equipment_categories" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_subscription" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_subscription" ADD FOREIGN KEY ("subscription_id") REFERENCES "subscriptiontypes" ("id") ON DELETE NO ACTION;

ALTER TABLE "rooms" ADD FOREIGN KEY ("category_id") REFERENCES "room_categories" ("id") ON DELETE NO ACTION;

ALTER TABLE "grouproles" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_groups" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_groups" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_equipment" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_equipment" ADD FOREIGN KEY ("equip_id") REFERENCES "equipment" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_siteroles" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_siteroles" ADD FOREIGN KEY ("siterole_id") REFERENCES "siteroles" ("id") ON DELETE NO ACTION;

ALTER TABLE "siterole_permissiontypes" ADD FOREIGN KEY ("siterole_id") REFERENCES "siteroles" ("id") ON DELETE NO ACTION;

ALTER TABLE "siterole_permissiontypes" ADD FOREIGN KEY ("permission_id") REFERENCES "permissiontypes" ("id") ON DELETE NO ACTION;

ALTER TABLE "grouproles_permissiontypes" ADD FOREIGN KEY ("grouprole_id") REFERENCES "grouproles" ("id") ON DELETE NO ACTION;

ALTER TABLE "grouproles_permissiontypes" ADD FOREIGN KEY ("permission_id") REFERENCES "permissiontypes" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_grouproles" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "user_grouproles" ADD FOREIGN KEY ("grouprole_id") REFERENCES "grouproles" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_equipment" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_equipment" ADD FOREIGN KEY ("equip_id") REFERENCES "equipment" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_rooms" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_equipment" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_equipment" ADD FOREIGN KEY ("equip_id") REFERENCES "equipment" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_chat_log" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") ON DELETE NO ACTION;

ALTER TABLE "room_chat_log" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_threads" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("group_id") REFERENCES "sitegroups" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("thread_id") REFERENCES "group_chat_threads" ("id") ON DELETE NO ACTION;

ALTER TABLE "group_chat_log" ADD FOREIGN KEY ("user_id") REFERENCES "useraccount" ("id") ON DELETE NO ACTION;

CREATE UNIQUE INDEX "user_id_grouprole_id" ON "user_grouproles"("user_id", "grouprole_id");

CREATE UNIQUE INDEX "user_id_group_id" ON "user_groups"("user_id", "group_id");

CREATE UNIQUE INDEX "user_id_equip_id" ON "user_equipment"("user_id", "equip_id");

CREATE UNIQUE INDEX "user_id_room_id" ON "user_rooms"("user_id", "room_id");

CREATE UNIQUE INDEX "user_id_siterole_id" ON "user_siteroles"("user_id", "siterole_id");

CREATE UNIQUE INDEX "siterole_id_permission_id" ON "siterole_permissiontypes"("siterole_id", "permission_id");

CREATE UNIQUE INDEX "grouprole_id_permission_id" ON "grouproles_permissiontypes"("grouprole_id", "permission_id");

CREATE UNIQUE INDEX "group_id_room_id" ON "group_rooms"("group_id", "room_id");

CREATE UNIQUE INDEX "room_id_equip_id" ON "room_equipment"("room_id", "equip_id");

CREATE UNIQUE INDEX "group_id_equip_id" ON "group_equipment"("group_id", "equip_id");