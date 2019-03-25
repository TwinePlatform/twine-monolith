import * as Knex from 'knex';
import * as moment from 'moment';
import { getConfig } from '../../../config';
import { csv } from '../../writers';
import { CommunityBusiness, CommunityBusinesses, VolunteerLogs } from '../../../src/models';


const ignoreRe = new RegExp(
  '(' +
  [
    'Sonja\'s demo organisation',
    'Twine Community Center',
    'Power to Change',
    'Reason Digital',
    'Extra Workspace',
    'Extra workspace',
    'nerv',
    'trainer',
    'Edward',
    'Inspired Neighbourhoods CIC',
  ].join('|')
  + ')'
);

export default async () => {
  const config = getConfig(process.env.NODE_ENV);
  const client = Knex(config.knex);
  const dates = dateRange();

  const cbs = (await CommunityBusinesses.get(client, { where: { deletedAt: null } }))
    .filter((cb) => !ignoreRe.test(cb.name) && !cb.name.includes('TEMPORARY') && cb.name !== 'as');

  const volData = (await Promise.all(dates.map(async (date) => {
    return {
      [date.format('MMM YYYY')]:
        await cbs.reduce(async (acc, cb) =>
          await acc + Number(await cbActiveInMonthVol(client, date, cb)), Promise.resolve(0)),
    };
  })))
  .reduce((acc, x) => {
    return { ...acc, ...x };
  }, {});

  const visData = (await Promise.all(dates.map(async (date) => {
    return {
      [date.format('MMM YYYY')]:
        await cbs.reduce(async (acc, cb) =>
          await acc + Number(await cbActiveInMonthVis(client, date, cb)), Promise.resolve(0)),
    };
  })))
  .reduce((acc, x) => {
    return { ...acc, ...x };
  }, {});

  csv(
    ['Quantity', ...dates.map((d) => d.format('MMM YYYY'))],
    [
      { Quantity: '# of active CBs (volunteer app)', ...volData },
      { Quantity: '# of active CBs (visitor app)', ...visData },
    ],
    'cbe_gen.csv'
  );

  return client.destroy();
};


const dateRange = () => {
  const from = moment('2017-01-01');
  const to = moment();
  const dates = [];
  const current = from.clone();

  while (current <= to) {
    dates.push(current.clone());
    current.add(1, 'month');
  }

  return dates;
};

const cbActiveInMonthVol = async (client: Knex, date: moment.Moment, cb: CommunityBusiness) => {
  const since = date.startOf('month').toDate();
  const until = date.endOf('month').toDate();
  const logs = await VolunteerLogs.fromCommunityBusiness(client, cb, { since, until });
  return logs.length >= 1;
};

const cbActiveInMonthVis = async (client: Knex, date: moment.Moment, cb: CommunityBusiness) => {
  const since = date.startOf('month').toDate();
  const until = date.endOf('month').toDate();
  const logs = await CommunityBusinesses.getVisitLogsWithUsers(client, cb, { since, until });
  return logs.length >= 1;
};
