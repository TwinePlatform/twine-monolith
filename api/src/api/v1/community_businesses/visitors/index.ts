import get from './get';
import put from './put';
import email from './email';

export default [
  ...get,
  ...put,
  ...email,
];
