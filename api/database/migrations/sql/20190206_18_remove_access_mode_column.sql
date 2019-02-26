/*
 * Remove access mode
 */

-- remove restricted rows
DELETE FROM access_role_permission WHERE access_mode = 'restricted';

-- update CONSTRAINT
ALTER TABLE access_role_permission DROP CONSTRAINT access_role_permission_unique_row;
ALTER TABLE access_role_permission ADD CONSTRAINT access_role_permission_unique_row UNIQUE (access_role_id, permission_id);

-- remove column
ALTER TABLE access_role_permission DROP COLUMN access_mode;
