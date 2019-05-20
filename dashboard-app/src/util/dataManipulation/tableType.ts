import moment from 'moment';

import Months from '../months';

export interface TableTypeItem {
  rowIdFromLogs: string;
  getColumnIdFromLogs: (x: any) => string;
}
interface TableType {
  ActivityByName: TableTypeItem;
  MonthByActivity: TableTypeItem;
  MonthByName: TableTypeItem;
}

const getMonthColumnId = (x: any) => moment(x.startedAt || x.createdAt).format(Months.format);

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
