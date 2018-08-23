/*
 * Twine API v1 /organisations
 *
 * See also:
 * - /api/v1/api.json
 */
import questions from './questions';
import get from './get';

export default [
  ...get,
  ...questions,
];
