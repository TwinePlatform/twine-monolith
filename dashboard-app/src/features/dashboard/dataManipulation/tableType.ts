import moment from 'moment';
import Months from '../../../lib/util/months';

export interface TableTypeItem {
  groupByX: 'Volunteer Name' | 'Activity' | 'Project';
  groupByY: 'Activity' | 'Month' | 'Project';
  xIdFromLogs: 'userId' | 'activity' | 'project';
  getYIdFromLogs: (x: any) => string;
}
interface TableType {
  ActivityByName: TableTypeItem;
  MonthByActivity: TableTypeItem;
  MonthByName: TableTypeItem;
  ActivityByProject: TableTypeItem;
  ProjectByActivity: TableTypeItem;
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
  ActivityByProject: {
    groupByX: 'Project',
    groupByY: 'Activity',
    xIdFromLogs: 'project',
    getYIdFromLogs: (x: any) => x.activity,
  },
  ProjectByActivity: {
    groupByX: 'Activity',
    groupByY: 'Project',
    xIdFromLogs: 'activity',
    getYIdFromLogs: (x: any) => x.project,
  },
};
