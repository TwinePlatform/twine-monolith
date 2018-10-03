import get from './get';
import put from './put';
import del from './delete';

export default [
  ...get,
  ...put,
  ...del,
];
