SET TIME ZONE 'UTC';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- User Table Creation
CREATE TABLE "users" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "email" text NOT NULL,
  "password" text NOT NULL,
  "username" text NOT NULL,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Groups Table
CREATE TABLE "groups" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "description" text,
  "public" boolean NOT NULL DEFAULT false,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);


-- Roles Table
CREATE TABLE "siteRoles" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Site Permissions Table
CREATE TABLE "sitePermissions" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Group Roles Table
CREATE TABLE "groupRoles" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "group_id" uuid REFERENCES "groups" ("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Group Permissions Table
CREATE TABLE "groupPermissions" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);


-- User Groups One-to-Many Join Table
CREATE TABLE "user_groups" (
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE,
  "group_id" uuid REFERENCES "groups" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "group_id")
);


-- User Site Roles One-to-Many Join Table
CREATE TABLE "user_siteRoles" (
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE,
  "role_id" uuid REFERENCES "siteRoles" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "role_id")
);

-- User Site Roles One-to-Many Join Table
CREATE TABLE "user_groupRoles" (
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE,
  "group_id" uuid REFERENCES "groups" ("id") ON DELETE CASCADE,
  "role_id" uuid REFERENCES "groupRoles" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "group_id", "role_id")
);

-- Group Roles to Permissions One-to-Many Join Table
CREATE TABLE "groupRole_groupPermissions" (
  "role_id" uuid REFERENCES "groupRoles" ("id") ON DELETE CASCADE,
  "permission_id" uuid REFERENCES "groupPermissions" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("role_id", "permission_id")
);

-- Site Roles to Permissions One-to-Many Join Table
CREATE TABLE "siteRole_sitePermissions" (
  "role_id" uuid REFERENCES "siteRoles" ("id") ON DELETE CASCADE,
  "permission_id" uuid REFERENCES "sitePermissions" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("role_id", "permission_id")
);


-- Rooms Table
CREATE TABLE "rooms" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "description" text NOT NULL,
  "public" boolean NOT NULL DEFAULT false,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);

-- Robots Table
CREATE TABLE "robots" (
  "id" uuid DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "description" text,
  "config" json NOT NULL,
  "create_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "modify_dt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id")
);


-- User Site Roles One-to-Many Join Table
CREATE TABLE "user_rooms" (
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE,
  "room_id" uuid REFERENCES "rooms" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "room_id")
);


-- User Site Roles One-to-Many Join Table
CREATE TABLE "group_rooms" (
  "group_id" uuid REFERENCES "groups" ("id") ON DELETE CASCADE,
  "room_id" uuid REFERENCES "rooms" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("group_id", "room_id")
);

-- User Site Roles One-to-Many Join Table
CREATE TABLE "user_robots" (
  "user_id" uuid REFERENCES "users" ("id") ON DELETE CASCADE,
  "robot_id" uuid REFERENCES "robots" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "robot_id")
);

-- User Site Roles One-to-Many Join Table
CREATE TABLE "group_robots" (
  "group_id" uuid REFERENCES "groups" ("id") ON DELETE CASCADE,
  "robot_id" uuid REFERENCES "robots" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("group_id", "robot_id")
);