import moment from 'moment';
import Months from '../../util/months';

export interface TableTypeItem {
  groupByX: string;
  groupByY: string;
  xIdFromLogs: string;
  getYIdFromLogs: (x: any) => string;
}
interface TableType {
  ActivityByName: TableTypeItem;
  MonthByActivity: TableTypeItem;
  MonthByName: TableTypeItem;
}

// TODO : get log type from api
const getMonthColumnId = (x: any) =>
  moment(x.startedAt || x.createdAt)
    .startOf('month')
    .startOf('day')
    .format(Months.format.verbose);

export const tableType: TableType = {
  ActivityByName: {
    groupByX: 'Volunteer Name',
    groupByY: 'Activity',
    xIdFromLogs: 'userId',
    getYIdFromLogs: (x: any) => x.activity,
  },
  MonthByActivity: {
    groupByX: 'Activity',
    groupByY: 'Month',
    xIdFromLogs: 'activity',
    getYIdFromLogs: getMonthColumnId,
  },
  MonthByName: {
    groupByX: 'Volunteer Name',
    groupByY: 'Month',
    xIdFromLogs: 'userId',
    getYIdFromLogs: getMonthColumnId,
  },
};
