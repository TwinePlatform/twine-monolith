import { Duration } from 'twine-util';
import { assocPath, mergeAll } from 'ramda';
import moment from 'moment';
import { DataTableRow } from '../../components/DataTable/types';
import { DurationUnitEnum } from '../../types';
import { roundToDecimal } from '../../util/mathUtil';

interface Params { data: any[]; months: string[]; unit: DurationUnitEnum; }

const toUnitDuration = (unit: DurationUnitEnum, duration: Duration.Duration) => {
  switch (unit){
    case DurationUnitEnum.DAYS:
      return roundToDecimal(Duration.toWorkingDays(duration));

    case DurationUnitEnum.HOURS:
      return roundToDecimal(Duration.toHours(duration));
  }
};

export const timeLogsToTable = ({ data, months, unit }: Params) =>
  data.reduce((acc: DataTableRow[], el: any) => {
    const activityExists = acc.some((x) => x.columns.Activity.content === el.activity);
    // doesn't work for more than 12 months
    const logMonth = moment(el.startedAt || el.createdAt).format('MMMM');
    if (activityExists) {
      return acc.map((x) => {
        if (x.columns.Activity.content === el.activity) {
          x.columns[logMonth].content =
            Number(x.columns[logMonth].content) + toUnitDuration(unit, el.duration);
        }
        return x;
      });
    }
    const monthsContent = months.map((m: string) => ({ [m]: { content: 0 } }));
    const newRow = {
      columns: {
        Activity: { content: el.activity, },
        [`Total ${unit}`]: { content: 0 },
        ...mergeAll(monthsContent),
        [logMonth]: { content: toUnitDuration(unit, el.duration),
        },
      },
    };
    return acc.concat(newRow);
  }, [])
  // messy way to calulate totals
  .map((row): DataTableRow => {
    const total = Object.values(row.columns).reduce((total, cell) =>
      typeof cell.content === 'number' ? total + cell.content : total, 0);
    return assocPath(['columns', `Total ${unit}`], { content: total }, row);
  });
