/*
 * Make user_details-child:write restricted access
 * for creating new visitors on the visitor app
 */

 UPDATE access_role_permission
SET
  access_mode = 'restricted'
WHERE access_role_id = (
    SELECT access_role_id
    FROM access_role
    WHERE access_role_name = 'ORG_ADMIN'
  ) 
  AND permission_id = (
    SELECT permission_id
    FROM permission
    WHERE permission_entity = 'user_details'
      AND permission_level = 'child'
      AND access_type = 'write'
  );
  