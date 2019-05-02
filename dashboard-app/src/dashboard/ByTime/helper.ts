import { Duration } from 'twine-util';
import { assocPath, mergeAll } from 'ramda';
import moment from 'moment';
import { DataTableRow } from '../../components/DataTable/types';
import { UnitEnum } from '../../types';
import { roundToDecimal } from '../../util/mathUtil';

interface Params { data: any[]; months: string[]; unit: UnitEnum; }

export const timeLogsToTable = ({ data, months, unit }: Params) =>
  data.reduce((acc: DataTableRow[], el: any) => {
    const activityExists = acc.some((x) => x.columns.Activity.content === el.activity);
    const logMonth = moment(el.createdAt).format('MMMM');
    if (activityExists) {
      return acc.map((x) => {
        if (x.columns.Activity.content === el.activity) {
          x.columns[logMonth].content = Number(x.columns[logMonth].content) + 1;
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
        [logMonth]: { content: unit === UnitEnum.HOURS
          ? roundToDecimal(Duration.toHours(el.duration))
          : roundToDecimal(Duration.toWorkingDays(el.duration)),
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
