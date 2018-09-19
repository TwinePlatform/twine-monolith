/*
 * Make user_details-child:write restricted access
 * for creating new visitors on the visitor app
 */

INSERT INTO access_role_permission (access_role_id, permission_id, access_mode)

VALUES (
  (
    SELECT access_role_id
    FROM access_role
    WHERE access_role_name = 'ORG_ADMIN'
  ),
  (
    SELECT permission_id
    FROM permission
    WHERE permission_entity = 'user_details'
      AND permission_level = 'child'
      AND access_type = 'write'
  ),
  'restricted'
);
  