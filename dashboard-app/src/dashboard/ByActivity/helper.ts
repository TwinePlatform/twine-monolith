import { Duration } from 'twine-util';
import { mergeAll } from 'ramda';
import moment from 'moment';
import { DataTableRow, DataTableProps } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { roundToDecimal, addDecimals } from '../../util/mathUtil';

interface Params {
  data: any[];
  volunteers: any[];
  activities: string[];
  unit: DurationUnitEnum;
}

const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit){
    case DurationUnitEnum.DAYS:
      return roundToDecimal(Duration.toWorkingDays(duration));

    case DurationUnitEnum.HOURS:
      return roundToDecimal(Duration.toHours(duration));
  }
};

const addDurationToTableContents = (
  row: DataTableRow,
  columnKey: string,
  unit: DurationUnitEnum,
  duration: Duration.Duration) =>
    addDecimals(Number(row.columns[columnKey].content), toUnitDuration(unit, duration));

export const activityLogsToTable = ({ data, activities, unit }: Params): DataTableProps => {
  const rows = data.reduce((acc: DataTableRow[], el: any) => {

  }, []);

  return {
    title: 'Volunteer Data By Activity',
    headers: ['Volunteer Name', `Total ${unit} volunteered`, ...activities],
    rows: [],
  };
};
