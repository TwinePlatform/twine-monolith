/*
 * Used to inspect the nature of the differences in logs
 * registered in the original source database and the target database
 *
 * If all is fine, any difference in logs should only correspond to test
 * accounts or junk logs.
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { difference, prop } from 'ramda';
import { getConfig } from '../config';

process.on('unhandledRejection', (err) => { throw err; });

const { _: [sourceUrl] } = parse(process.argv.slice(2));

if (!sourceUrl) {
  throw new Error('Missing arguments');
}

(async () => {
  const { knex: config } = getConfig(process.env.NODE_ENV);
  const target = Knex(config);
  const source = Knex({ client: 'pg', connection: sourceUrl });

  const trgtLogs = await target('visit_log')
    .select(['visit_log_id', 'created_at'])
    .whereBetween('created_at', [new Date(0), new Date('2018-12-13T19:00:00')]);

  const srcLogs = await source('visits')
    .select(['id', 'date']);

  console.log(`TARGET: ${trgtLogs.length} logs`);
  console.log(`SOURCE: ${srcLogs.length} logs`);

  const l = trgtLogs.map(prop('created_at')).sort();
  const r = srcLogs.map(prop('date')).sort();

  const diffLR = difference(l, r);
  const diffRL = difference(r, l);

  // Logs in target that are not in source
  // (Should be empty!)
  console.log('DIFF, TARGET -> SRC', diffLR.length);
  diffLR.forEach((l) => console.log(l));

  // Logs in source that are not in target
  // (Should only be test accounts or junk logs!)
  console.log('DIFF, SRC -> TARGET', diffRL.length);
  diffRL.forEach((l) => console.log(l));

  // Only look at diffRL since diffLR is (should be) empty
  const diffLogs = srcLogs.filter((l: any) => diffRL.includes(l.date));

  const fullLogs = await source
    .select({
      org_name: 'cbusiness.org_name',
      user_name: 'users.fullname',
      user_email: 'users.email',
      created_at: 'visits.date',
      activity: 'activities.name',
    })
    .from('visits')
    .innerJoin('cbusiness', 'cbusiness.id', 'visits.cb_id')
    .innerJoin('users', 'users.id', 'usersid')
    .leftOuterJoin('activities', 'activities.id', 'visits.activitiesid')
    .whereIn('visits.id', diffLogs.map(prop('id')));

  fullLogs.forEach((l: any) => {
    console.log(l.created_at, l.activity, l.user_name, l.user_email, l.org_name);
  });

  await target.destroy();
  await source.destroy();
})();
