/*
 * Raw volunteer logs
 *
 * Ad hoc data request
 */
import * as Knex from 'knex';
import { getConfig } from '../../config';
import { csv } from '../writers';
import {
  CommunityBusinesses,
  VolunteerLogs,
  Volunteers,
  Duration,
} from '../../src/models';
import { Roles } from '../../src/auth';


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

  const logs = await VolunteerLogs.get(client, { order: ['startedAt', 'asc'] });

  const data = (await Promise.all(logs.map(async (log) => {
    const user = await Volunteers.getOne(client, { where: { id: log.userId } });
    const org = await CommunityBusinesses.getOne(client, { where: { id: log.organisationId } });
    const creator = log.createdBy
      ? await Volunteers.getOne(client, { where: { id: log.createdBy } })
      : null;
    const roles = creator
      ? await Roles.fromUserWithOrg(client, { userId: log.createdBy, organisationId: org.id })
      : null;


    if (ignoreRe.test(org.name) || org.name.includes('TEMPORARY') || org.name === 'as') {
      return null;
    } else {
      return {
        id: log.id,
        activity: log.activity,
        project: log.project,
        duration: Duration.toHours(log.duration),
        startedAt: new Date(log.startedAt).toISOString(),
        createdAt: log.createdAt && new Date(log.createdAt).toISOString(),
        modifiedAt: log.modifiedAt && new Date(log.modifiedAt).toISOString(),
        deletedAt: log.deletedAt && new Date(log.deletedAt).toISOString(),
        creatorId: creator ? creator.id : '',
        creatorName: creator ? creator.name : '',
        creatorRole: roles && roles.length ? roles[0] : '',
        organisationId: org.id,
        organisation: org.name,
        _360GivingId: org._360GivingId,
        sector: org.sector,
        region: org.region,
        turnoverBand: org.turnoverBand,
        orgAddress1: org.address1,
        orgAddress2: org.address2,
        orgPostCode: org.postCode,
        orgTownCity: org.townCity,
        userId: user.id,
        userName: user.name,
        gender: user.gender,
        birthYear: user.birthYear,
        disability: user.disability,
        ethnicity: user.ethnicity,
        phoneNumber: user.phoneNumber,
        userPostCode: user.postCode,
        userCreatedAt: new Date(user.createdAt).toISOString(),
      };
    }
  }))).filter((x) => x !== null);

  csv(
    [
      'id',
      'activity',
      'project',
      'duration',
      'startedAt',
      'createdAt',
      'modifiedAt',
      'deletedAt',
      'creatorId',
      'creatorName',
      'creatorRole',
      'organisationId',
      'organisation',
      '_360GivingId',
      'sector',
      'region',
      'turnoverBand',
      'orgAddress1',
      'orgAddress2',
      'orgPostCode',
      'orgTownCity',
      'userId',
      'userName',
      'gender',
      'birthYear',
      'disability',
      'ethnicity',
      'phoneNumber',
      'userPostCode',
      'userCreatedAt',
    ],
    data,
    'volunteer_logs_raw.csv'
  );

  return client.destroy();
};

