-- Populate Site Roles
INSERT INTO public.siteroles
 	(id, name)
VALUES
	('853724f0-ef31-467d-a739-58bcc081a540', 'user'),
	('b8ad054d-8c88-4163-8bac-7bb9659162a2', 'moderator'),
	('5f21659e-888a-4354-8b10-277ebf7b088a', 'l1_support'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'l2_support'),
	('d46063d8-1c48-4d73-8207-ef873e70af1c', 'l3_support'),
	('3acdd306-7225-4ffc-ad11-97c09c9ed32b', 'admin'),
	('70a39644-3304-4bbc-a85d-4bca15f50fed', 'super_user'),
	('a19f627d-98f4-44b3-b859-6af69e5b5c05', 'site_owner');

-- Populate Site Permissions
INSERT INTO public.sitepermissions
	(id, name)
VALUES
    -- Admin Roles
    ('516b9952-d3fb-42d7-b187-2c49255bdb69', 'create_role'),
	('b3dc9319-c9c0-4cb8-b00c-9029a599eed9', 'read_role'),
	('09470072-d3bd-4fed-9407-b116874c526e', 'update_role'),
	('bfe56333-0537-4571-bdf3-6464b82cd131', 'delete_role'),

    -- L1 Support Roles
	('4417d9b3-339b-444f-bdec-78b8effb2d3e', 'req_password_reset'),

    -- L3 Support Roles
	('84807530-d09e-4527-a337-ac4c583c6bdf', 'assign_role'),
	('0f58ae58-108f-4ce7-9c9b-54326bbf37aa', 'remove_role'),

    -- User Roles
	('b4071041-8e47-4b46-9d07-748a984fecb1', 'site_access'),

	('1077c00a-4d3a-458a-be88-56d1d3cfdf56', 'read_user_self'),
	('7e5e9bbc-1d5a-4977-ad8c-905072571adb', 'update_user_self'),
	('1eb0719d-838e-4c57-a3a7-9e1439650459', 'delete_user_self'),
	
	('c575d0ab-3e2b-4e3e-bd19-9a4ca97eb28b', 'create_group_self'),
	('bb6f794e-e0e5-400e-a301-d285fbe2e962', 'read_group_self'),
	('d035ad4f-c510-4fbe-a86a-d1f4a3bc49ff', 'update_group_self'),
	('5e4a722c-ebeb-48e1-b26a-4b17e1aff828', 'delete_group_self'),
	
	('3df9506d-7adc-4889-958f-189daf4a52e7', 'create_room_self'),
	('dd90b3a7-031a-405f-bcba-dc3ca3b11c76', 'read_room_self'),
	('b2ff4d87-eb25-4777-afc5-19466b5ff9d1', 'update_room_self'),
	('a76ceac4-fc74-44e6-8325-3e74d334f7c8', 'delete_room_self'),
	
	('0f424834-caa8-4443-927f-472960ad40f8', 'create_equip_self'),
	('59f4a08c-a498-4129-8fcf-b35e87d241e8', 'read_equip_self'),
	('6a5664f0-1d28-4269-883a-d8b362b1cf57', 'update_equip_self'),
	('c3934131-658e-43c9-a8b5-3f207d88140f', 'delete_equip_self'),
	
	('2332da90-06c7-45d4-95a5-95fc7e4c9853', 'browse_users_public'),
	('72eef18a-90bb-40ea-aac4-75883ef51a64', 'browse_groups_public'),
	('61fc32b7-d165-4c42-a3ea-67e70ffc2652', 'browse_rooms_public'),
	('87813dbe-496b-4b10-8ac7-5f790a87c07d', 'browse_equip_public'),
	('9f379465-0adb-4daa-a7b8-1c42949dba4f', 'view_user_public'),
	('6bf76d45-d706-434b-8ae5-8b87cf3b4fc6', 'view_group_public'),
	('9823bc6b-104e-4fd2-b03b-b63faf102f90', 'view_room_public'),
	('6259f8e4-6412-4e88-a961-77965300f0d5', 'view_equip_public'),

    -- L2 Support
	('d05372f2-16a2-4e04-afa9-1a7584b6b68a', 'read_user_global'),
    ('9c7d86a5-515a-43ba-ac7e-09bdb5c63484', 'update_user_global'),
	('079dff9b-39ee-4566-b83f-55fa91258923', 'delete_user_global'),
	
	('da65a061-7c7f-4e07-83e9-3867394a33ac', 'create_group_global'),
	('f9728ebc-3163-49cd-8d76-8e1b243801f7', 'read_group_global'),
    ('7d4dfa9a-9be0-424a-99ee-032d7b23018e', 'update_group_global'),
	('e314986a-c403-48c5-819e-663e5b217698', 'delete_group_global'),
	
	('00e9ae28-90e6-40b3-8425-700e7d9aa10b', 'create_room_global'),
	('a6146ba6-e714-419b-a692-738435aa6869', 'read_room_global'),
    ('f8ef984a-d8c0-4510-8d6a-4bd8a898d004', 'update_room_global'),
	('0e003c08-7885-4fe2-ab8c-a95fce17cfe1', 'delete_room_global'),
	
	('dce54ca4-3af6-4af7-b1b8-822a0d003407', 'create_equip_global'),
	('3232ffbd-4dd2-4ff0-ac98-823d999e1546', 'read_equip_global'),
	('47dccb89-3f49-48ab-93bf-c1c7f991a6ba', 'update_equip_global'),
	('0db7e210-91be-4c9c-b274-fc6d7bc027bb', 'delete_equip_global'),
	
	('ca1ff51b-9749-4ab1-af57-96d4fbdfac73', 'browse_users_global'),
	('c2b9fadc-7f26-479c-a0bf-095a39d12d79', 'browse_groups_global'),
	('03addaa1-a99f-4c03-9096-b64d6ed23cf0', 'browse_rooms_global'),
	('da03944f-dab1-4ddd-9d6f-f7317bd6ce6e', 'browse_equip_global'),
	('5213173a-85bb-4612-926a-e870fff30ee9', 'view_user_global'),
	('22ada866-5626-4c4f-9956-9b7f1f1459be', 'view_group_global'),
	('369a9c36-457c-4b73-86f2-716aa4c3801a', 'view_room_global'),
	('835961a5-8dc8-4d9f-8ff8-6c8241a8cc10', 'view_equip_global');


-- Create Site Role / Site Permission Associations
INSERT INTO public.siterole_sitepermissions
    (siterole_id, sitepermission_id)
VALUES
-- user role id, permission_id
	('853724f0-ef31-467d-a739-58bcc081a540', 'b4071041-8e47-4b46-9d07-748a984fecb1'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '1077c00a-4d3a-458a-be88-56d1d3cfdf56'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '7e5e9bbc-1d5a-4977-ad8c-905072571adb'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '1eb0719d-838e-4c57-a3a7-9e1439650459'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'c575d0ab-3e2b-4e3e-bd19-9a4ca97eb28b'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'bb6f794e-e0e5-400e-a301-d285fbe2e962'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'd035ad4f-c510-4fbe-a86a-d1f4a3bc49ff'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '5e4a722c-ebeb-48e1-b26a-4b17e1aff828'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '3df9506d-7adc-4889-958f-189daf4a52e7'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'dd90b3a7-031a-405f-bcba-dc3ca3b11c76'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'b2ff4d87-eb25-4777-afc5-19466b5ff9d1'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'a76ceac4-fc74-44e6-8325-3e74d334f7c8'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '0f424834-caa8-4443-927f-472960ad40f8'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '59f4a08c-a498-4129-8fcf-b35e87d241e8'),
    ('853724f0-ef31-467d-a739-58bcc081a540', '6a5664f0-1d28-4269-883a-d8b362b1cf57'),
    ('853724f0-ef31-467d-a739-58bcc081a540', 'c3934131-658e-43c9-a8b5-3f207d88140f'),

	('853724f0-ef31-467d-a739-58bcc081a540', '2332da90-06c7-45d4-95a5-95fc7e4c9853'),
	('853724f0-ef31-467d-a739-58bcc081a540', '72eef18a-90bb-40ea-aac4-75883ef51a64'),
	('853724f0-ef31-467d-a739-58bcc081a540', '61fc32b7-d165-4c42-a3ea-67e70ffc2652'),
	('853724f0-ef31-467d-a739-58bcc081a540', '87813dbe-496b-4b10-8ac7-5f790a87c07d'),
	('853724f0-ef31-467d-a739-58bcc081a540', '9f379465-0adb-4daa-a7b8-1c42949dba4f'),
	('853724f0-ef31-467d-a739-58bcc081a540', '6bf76d45-d706-434b-8ae5-8b87cf3b4fc6'),
	('853724f0-ef31-467d-a739-58bcc081a540', '9823bc6b-104e-4fd2-b03b-b63faf102f90'),
	('853724f0-ef31-467d-a739-58bcc081a540', '6259f8e4-6412-4e88-a961-77965300f0d5'),

-- administrator role id, permission_id
    ('3acdd306-7225-4ffc-ad11-97c09c9ed32b', '516b9952-d3fb-42d7-b187-2c49255bdb69'),
    ('3acdd306-7225-4ffc-ad11-97c09c9ed32b', 'b3dc9319-c9c0-4cb8-b00c-9029a599eed9'),
    ('3acdd306-7225-4ffc-ad11-97c09c9ed32b', '09470072-d3bd-4fed-9407-b116874c526e'),
    ('3acdd306-7225-4ffc-ad11-97c09c9ed32b', 'bfe56333-0537-4571-bdf3-6464b82cd131'),
-- L1 support role id, permission_id
    ('5f21659e-888a-4354-8b10-277ebf7b088a', '4417d9b3-339b-444f-bdec-78b8effb2d3e'),
-- L3 Support role id, permission_id
	('d46063d8-1c48-4d73-8207-ef873e70af1c', '84807530-d09e-4527-a337-ac4c583c6bdf'),
	('d46063d8-1c48-4d73-8207-ef873e70af1c', '0f58ae58-108f-4ce7-9c9b-54326bbf37aa'),
-- L2 Support role id, permission_id
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'd05372f2-16a2-4e04-afa9-1a7584b6b68a'),
    ('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '9c7d86a5-515a-43ba-ac7e-09bdb5c63484'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '079dff9b-39ee-4566-b83f-55fa91258923'),
	
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'da65a061-7c7f-4e07-83e9-3867394a33ac'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'f9728ebc-3163-49cd-8d76-8e1b243801f7'),
    ('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '7d4dfa9a-9be0-424a-99ee-032d7b23018e'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'e314986a-c403-48c5-819e-663e5b217698'),
	
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '00e9ae28-90e6-40b3-8425-700e7d9aa10b'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'a6146ba6-e714-419b-a692-738435aa6869'),
    ('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'f8ef984a-d8c0-4510-8d6a-4bd8a898d004'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '0e003c08-7885-4fe2-ab8c-a95fce17cfe1'),
	
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'dce54ca4-3af6-4af7-b1b8-822a0d003407'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '3232ffbd-4dd2-4ff0-ac98-823d999e1546'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '47dccb89-3f49-48ab-93bf-c1c7f991a6ba'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '0db7e210-91be-4c9c-b274-fc6d7bc027bb'),

	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'ca1ff51b-9749-4ab1-af57-96d4fbdfac73'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'c2b9fadc-7f26-479c-a0bf-095a39d12d79'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '03addaa1-a99f-4c03-9096-b64d6ed23cf0'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', 'da03944f-dab1-4ddd-9d6f-f7317bd6ce6e'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '5213173a-85bb-4612-926a-e870fff30ee9'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '22ada866-5626-4c4f-9956-9b7f1f1459be'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '369a9c36-457c-4b73-86f2-716aa4c3801a'),
	('edc0c949-5afd-4206-af01-aa4f7ea4c4f8', '835961a5-8dc8-4d9f-8ff8-6c8241a8cc10');

-- Populate Group Permissions
INSERT INTO public.grouppermissions
	(name)
VALUES
    ('read_group'),
    ('update_group'),
    ('delete_group'),

    ('create_role'),
    ('read_role'),
    ('update_role'),
    ('delete_role'),

    ('create_role_permissions'),
    ('read_role_permissions'),
    ('delete_role_permissions'),

    ('create_user_role'),
    ('read_user_role'),
    ('delete_user_role'),
    
    ('create_group_user'),
    ('read_group_user'),
    ('delete_group_user'),
    
    ('create_equip'),
    ('read_equip'),
    ('update_equip'),
    ('delete_equip'),

    ('create_room'),
    ('read_room'),
    ('update_room'),
    ('delete_room');

-- Populate Room Categories
INSERT INTO public.room_categories
 	(name)
VALUES
	('Education'),
	('Games'),
	('Logistics'),
	('Agriculture'),
	('Manufacturing'),
	('Other');
	
-- Populate Equipment Categories
INSERT INTO public.equipment_categories
	(name)
VALUES
    ('Robots'),
	('Data Transmitters'),
	('Data Receivers'),
	('Data Multimodal'),
	('Other');


-- Populate User Types
INSERT INTO public.usertypes
    (name)
VALUES
    ('Free'),
    ('T1 Subscriber'),
    ('T2 Subscriber'),
    ('T3 Subscriber'),
    ('Enterprise'),
    ('Ubermensch');