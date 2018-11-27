import get from './get';
import put from './put';
import del from './delete';
import volunteerLogs from './volunteer_logs';

export default [
  ...get,
  ...put,
  ...del,
  ...volunteerLogs,
];
