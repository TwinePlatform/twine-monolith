import Moment from 'moment';


export const getTimeDiff = (start: Date, end: Date): [number, number] => { //eslint-disable-line
  if (!start || !end) return [0, 0];
  if (Moment(end).isBefore(start)) return [0, 0];

  const diffHours = Moment(end).diff(Moment(start), 'hours');
  const diffMins = Moment(end).startOf('minute').diff(Moment(start).startOf('minute'), 'minutes') % 60;
  return [diffHours, diffMins];
};
