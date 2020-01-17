import moment from 'moment';

export const getDateWithCurrentTime = (date: Date) => moment()
  .set('day', date.getDay())
  .set('month', date.getMonth())
  .set('year', date.getFullYear())
  .toDate();
