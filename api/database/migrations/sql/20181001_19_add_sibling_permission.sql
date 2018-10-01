/*
 * Create `user_details-sibling` permissions and link to VOLUNTEER_ADMIN
 */

 ALTER TYPE ENUM_permission_level ADD VALUE 'sibling';

 INSERT INTO permission (permission_entity, permission_level, access_type) 
 VALUES 
  ('user_details', 'sibling', 'read'),
  ('user_details', 'sibling', 'write');

INSERT INTO access_role_permission (access_role_id, permission_id, access_mode) 
VALUES 
  (
    (SELECT access_role_id FROM access_role WHERE access_role_name = 'VOLUNTEER_ADMIN'),
    (SELECT permission_id FROM permission WHERE permission_entity = 'user_details' AND permission_level = 'sibling' AND access_type = 'read'),
    'full'
  ),
  (
    (SELECT access_role_id FROM access_role WHERE access_role_name = 'VOLUNTEER_ADMIN'),
    (SELECT permission_id FROM permission WHERE permission_entity = 'user_details' AND permission_level = 'sibling' AND access_type = 'write'),
    'full'
  );