/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import get from './get';
import put from './put';
import register from './register';
import adminLogin from './login';
import logout from './logout';
import visitors from './visitors';
import volunteers from './volunteers';
import password from './password';
import roles from './roles';
import volunteers from './volunteers';

export default [
  ...get,
  ...put,
  ...register,
  ...adminLogin,
  ...logout,
  ...visitors,
  ...volunteers,
  ...password,
  ...roles,
  ...volunteers,
];
