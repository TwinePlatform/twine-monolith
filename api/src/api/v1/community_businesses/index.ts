import get from './get';
import put from './put';
import feedback from './feedback';
import questions from './questions';
import visitActivites from './visit_activities';
import visitors from './visitors';
import visitLogs from './visit_logs';
import visitLogAggregates from './visit_logs_aggregates';

export default [
  ...get,
  ...put,
  ...feedback,
  ...questions,
  ...visitActivites,
  ...visitors,
  ...visitLogs,
  ...visitLogAggregates,
];
