import moment from 'moment';
import Months from '../../util/months';

export interface TableTypeItem {
  rowIdFromLogs: string;
  getColumnIdFromLogs: (x: any) => string;
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
    rowIdFromLogs: 'userId',
    getColumnIdFromLogs: (x: any) => x.activity,
  },
  MonthByActivity: {
    rowIdFromLogs: 'activity',
    getColumnIdFromLogs: getMonthColumnId,
  },
  MonthByName: {
    rowIdFromLogs: 'userId',
    getColumnIdFromLogs: getMonthColumnId,
  },
};
