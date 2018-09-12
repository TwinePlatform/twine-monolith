/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import get from './get';
import put from './put';
import register from './register';
import adminLogin from './login_admin';
import logout from './logout';
import visitors from './visitors';
import passwordForgot from './password_forgot';

export default [
  ...get,
  ...put,
  ...register,
  ...adminLogin,
  ...logout,
  ...visitors,
  ...passwordForgot,
];
