/*
 * Twine API v1 /users
 *
 * See also:
 * - /api/v1/api.json
 */
import get from './get';
import register from './register';


export default [
  ...register,
  ...get,
];
