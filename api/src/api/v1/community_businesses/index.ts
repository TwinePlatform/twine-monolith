import get from './get';
import put from './put';
import feedback from './feedback';
import visitActivites from './visit_activities';
import visitors from './visitors';
import visitLogs from './visit_logs';
import visitLogAggregates from './visit_logs_aggregates';
import volunteers from './volunteers';
import volunteerLogs from './volunteer_logs';
import register from './register';
import cbAdmins from './cb_admins';
import temporary from './temporary';

export default [
  ...get,
  ...put,
  ...feedback,
  ...visitActivites,
  ...visitors,
  ...visitLogs,
  ...visitLogAggregates,
  ...volunteers,
  ...volunteerLogs,
  ...register,
  ...cbAdmins,
  ...temporary,
];
