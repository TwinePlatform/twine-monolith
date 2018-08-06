/*
 * Twine API v1 /organisations
 *
 * See also:
 * - /api/v1/api.json
 */
import Questions from './questions';
import Get from './get';

export default [
  ...Get,
  ...Questions,
];
