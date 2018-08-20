/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import get from './get';
import register from './register';
import adminLogin from './login_admin';
import logout from './logout';

export default [
  ...register,
  ...get,
  ...adminLogin,
  ...logout,
];
