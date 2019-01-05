/*
 * Re-migration of visit logs
 *
 * Made necessary because of the problems identified in:
 * - https://github.com/TwinePlatform/data-sync/issues/39
 *
 * Usage:
 *  npm run exc ./bin/remigrate_visit_logs [source_url] [--ignore=a,b,c] [--ignoreNullAct=a]
 *
 * Arguments:
 *  source_url: Connection URL for PostgreSQL database of original visitor app
 *
 * Flags:
 *  ignore: comma-separated list of qr codes to disregard from the migration
 *  ignoreNullAct: qr code to disregard if corresponding activity is null (junk log)
 *
 * This script assumes only those users already in the target database need their logs
 * re-migrated. Any errors with migration or merging of user accounts must be handled separately,
 * before this script is run.
 *
 * General algorithm is:
 * 1. Get all visitors from target database
 * 2. For each visitor
 *   2.1 Get list of logs added to target DB (_after_ data sync), A
 *   2.2 Get list of logs from source DB (_before data sync), B
 *   2.3 Delete all logs for visitor from target database
 *   2.4 Insert the logs (A concat B) into the target database
 */
import * as parse from 'minimist';
import * as Knex from 'knex';
import { Visitors, Organisations } from '../src/models';
import { getConfig } from '../config';


process.on('unhandledRejection', (err) => { throw err; });

const { _: [sourceUrl], ignore, ignoreNullAct } = parse(process.argv.slice(2));

const ignoreQrCodes = ignore.split(',');

if (!sourceUrl) {
  throw new Error('Missing arguments');
}

(async () => {
  const { knex: config } = getConfig(process.env.NODE_ENV);
  const target = Knex(config);
  const source = Knex({ client: 'pg', connection: sourceUrl });

  try {
    // 1. Get all visitors from target database
    const visitors = await Visitors.get(target);

    console.log(`Checking logs for ${visitors.length} visitors`);

    await target.transaction(async (trx) => {
      // Maintain count of logs for diagnostics
      let count = 0;

      // 2. For each visitor
      // // for-loop instead of map somehow gets around connection limit issue
      for (let i = 0; i < visitors.length; i = i + 1) {
        const visitor = visitors[i];

        // Special cases - ignore test accounts that have data inconsistencies
        // // these are test users that are registered to real organisations
        // // the data is of no value and can be ignored to avoid the issues they cause
        // // (see https://github.com/TwinePlatform/data-sync/issues/39#issuecomment-451682133)
        if (ignoreQrCodes.includes(visitor.qrCode)) {
          continue;
        }

        const org = await Organisations.fromUser(trx, { where: { id: visitor.id } });

        // 2.1 Get list of logs added to target DB (_after_ data sync), A
        const trgtLogsPostSync = await trx
          .select({
            qrCode: 'user_account.qr_code',
            userId: 'user_account.user_account_id',
            activity: 'visit_activity_name',
            createdAt: 'visit_log.created_at',
          })
          .from('visit_log')
          .innerJoin(
            'user_account',
            'user_account.user_account_id',
            'visit_log.user_account_id')
          .innerJoin(
            'visit_activity',
            'visit_activity.visit_activity_id',
            'visit_log.visit_activity_id')
          .where('user_account.qr_code', visitor.qrCode)
          .whereBetween('visit_log.created_at', [new Date('2018-12-14T19:00:00'), new Date()]);

        // 2.2 Get list of logs from source DB (_before data sync), B
        const sourceLogsPreSync = await source
          .select({
            qrCode: 'users.hash',
            activity: 'activities.name',
            createdAt: 'visits.date',
          })
          .from('visits')
          .innerJoin(
            'users',
            'users.id',
            'visits.usersid')
          .leftOuterJoin(
            'activities',
            'activities.id',
            'visits.activitiesid')
          .where('users.hash', visitor.qrCode)
          .whereBetween('visits.date', [new Date(0), new Date('2018-12-14T19:00:00')]);

        const logs = sourceLogsPreSync.concat(trgtLogsPostSync);

        const pl = await Promise.all(logs.map(async (log: any) => {
          // Need to pre-fetch activities instead of using sub-queries
          // in order to prevent "multiple rows" or "null" errors
          const activities = await trx('visit_activity')
            .select(['visit_activity_id', 'deleted_at'])
            .where({
              visit_activity_name: log.activity,
              organisation_id: org.id,
            });

          // If multiple activities are returned, this is probably
          // because one has been deleted (and then re-added).
          // Select the non-deleted one.
          const activityId = ((activities.length > 1
            ? activities.find((a: any) => a.deleted_at !== null)
            : activities[0]) || {}).visit_activity_id;

          // Ignoring junk visits
          // // This is a real user who registered clearly junk visits,
          // // since the visit activities came from a test organisation
          // // (see https://github.com/TwinePlatform/data-sync/issues/39#issuecomment-451682133)
          if (!activityId && visitor.qrCode === ignoreNullAct) {
            return null;
          }

          return {
            user_account_id: log.userId || trx('user_account')
              .select('user_account_id')
              .where('qr_code', log.qrCode),
            visit_activity_id: activityId,
            created_at: log.createdAt,
          };
        }));

        // needed because of line 138
        const payload = pl.filter((x) => x !== null);

        console.log(
          `${visitor.id}@${org.name} :: `,
          `Source logs: ${sourceLogsPreSync.length} | `,
          `Target logs: ${trgtLogsPostSync.length}`,
          `Inserting ${payload.length} logs`
        );

        try {
          console.log(`Visitor ${visitor.qrCode} has ${trgtLogsPostSync.length} new logs`);
          await trx('visit_log').del().where('user_account_id', visitor.id);
          await trx('visit_log').insert(payload);
          count = count + payload.length;

        } catch (error) {
          console.log('Oops');
          console.log(visitor.id, visitor.qrCode);
          console.log(trx('visit_log').insert(payload).toString());

          throw error;
        }
      }

      console.log(`Inserted ${count} logs in total`);

    });

  } catch (error) {
    console.log(error);

  }

  await target.destroy();
  await source.destroy();
})();
