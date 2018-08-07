/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import get from './get';
import register from './register';
import login from './login';

export default [
  ...register,
  ...get,
  ...login,
];
