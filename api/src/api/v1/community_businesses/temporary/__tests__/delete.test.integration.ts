import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../../server';
import { getConfig } from '../../../../../../config';
import { User,
  Users,
  Organisations,
  CommunityBusinesses,
  VolunteerLogs } from '../../../../../models';
import { StandardCredentials } from '../../../../../auth/strategies/standard';
import { getTrx } from '../../../../../../tests/utils/database';
import { RoleEnum } from '../../../../../auth';


describe('DELETE /community-businesses/temporary/:id', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;
  let twAdmin: User;

  let twAdminCreds: Hapi.AuthCredentials;

  const config = getConfig(process.env.NODE_ENV);

  beforeAll(async () => {
    server = await init(config);
    knex = server.app.knex;
    server.app.EmailService = {
      send: () => Promise.resolve({
        To: '',
        SubmittedAt: '',
        MessageID: '',
        ErrorCode: 0,
        Message: '',
      }),
      sendBatch: () => Promise.resolve([{
        To: '',
        SubmittedAt: '',
        MessageID: '',
        ErrorCode: 0,
        Message: '',
      }]),
    };


    twAdmin = await Users.getOne(knex, { where: { name: 'Big Boss' } });
    const aperture = await Organisations.getOne(knex, { where: { name: 'Aperture Science' } });
    twAdminCreds = await StandardCredentials.get(knex, twAdmin, aperture);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  test('success :: user TWINE_ADMIN successfully deletes temp cb & cb admin', async () => {
    // create temp cb
    const res = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/register/temporary',
      credentials: twAdminCreds,
      payload: { orgName: 'Shinra Electric Power Company' },
    });
    expect(res.statusCode).toBe(200);
    const { communityBusiness: tempCb, cbAdmin: tempCbAdmin } = (<any> res.result).result;

    // delete account
    const res2 = await server.inject({
      method: 'DELETE',
      url: `/v1/community-businesses/temporary/${tempCb.id}`,
      credentials: twAdminCreds,
    });
    expect(res2.statusCode).toBe(200);
    const cbExists = await CommunityBusinesses.exists(trx, { where: { id: tempCb.id } });
    const adminExists = await Users.exists(trx, { where: { id: tempCbAdmin.id } });
    expect(cbExists).toBeFalsy();
    expect(adminExists).toBeFalsy();
  });

  test('success :: successfully deletes related logs', async () => {
    // create temp cb
    const resCreate = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/register/temporary',
      credentials: twAdminCreds,
      payload: { orgName: 'Shinra Electric Power Company' },
    });
    expect(resCreate.statusCode).toBe(200);
    const { communityBusiness: tempCb, cbAdmin: tempCbAdmin } = (<any> resCreate.result).result;

    // credentials for future requests
    const tempCredentials: Hapi.AuthCredentials =
      await StandardCredentials.get(trx, tempCbAdmin, tempCb);

    // create visitor
    const resAddVisitor = await server.inject({
      method: 'POST',
      url: '/v1/users/register/visitors',
      payload: {
        organisationId: tempCb.id,
        name: 'Cloud Strife',
        gender: 'male',
        birthYear: 1988,
        email: 'cstrife@soldier.com',
      },
      credentials: tempCredentials,
    });
    expect(resAddVisitor.statusCode).toBe(200);
    const visitor = (<any> resAddVisitor.result).result;

    // add visit activty
    const resAddVisitActivity = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visit-activities',
      payload: {
        name: 'Hair Styling',
        category: 'Adult skills building',
      },
      credentials: tempCredentials,
    });
    expect(resAddVisitActivity.statusCode).toBe(200);
    const visitActity = (<any> resAddVisitActivity.result).result;

    // add visitor log
    const resAddLog = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/visit-logs',
      payload: {
        userId: visitor.id,
        visitActivityId: visitActity.id,
      },
      credentials: tempCredentials,
    });
    expect(resAddLog.statusCode).toBe(200);
    const visitLog = (<any> resAddLog.result).result;

    // add volunteer
    const resAddVolunteer = await server.inject({
      method: 'POST',
      url: '/v1/users/register/volunteers',
      payload: {
        organisationId: tempCb.id,
        name: 'Yuffie Kisaragi',
        gender: 'female',
        birthYear: 1988,
        email: 'yuff@thethief.com',
        password: 'I<3daggers',
        role: RoleEnum.VOLUNTEER,
      },
      credentials: tempCredentials,
    });
    expect(resAddVolunteer.statusCode).toBe(200);
    const volunteer = (<any> resAddVolunteer.result).result;

    // add volunteer log
    const resAddVolunteerLog = await server.inject({
      method: 'POST',
      url: '/v1/community-businesses/me/volunteer-logs',
      payload: {
        activity: 'Committee work, AGM',
        userId: volunteer.id,
        duration: {
          minutes: 20,
          hours: 2,
        },
        startedAt: (new Date).toISOString(),
      },
      credentials: tempCredentials,
    });
    expect(resAddVolunteerLog.statusCode).toBe(200);
    const volunteerLog = (<any> resAddVolunteerLog.result).result;

    // delete account
    const resDelete = await server.inject({
      method: 'DELETE',
      url: `/v1/community-businesses/temporary/${tempCb.id}`,
      credentials: twAdminCreds,
    });
    expect(resDelete.statusCode).toBe(200);

    // check everything is deleted
    const cbExists = await CommunityBusinesses.exists(trx, { where: { id: tempCb.id } });
    expect(cbExists).toBeFalsy();

    const adminExists = await Users.exists(trx, { where: { id: tempCbAdmin.id } });
    expect(adminExists).toBeFalsy();

    const visitorExists = await Users.exists(trx, { where: { id: visitor.id } });
    expect(visitorExists).toBeFalsy();

    const volunteerExists = await Users.exists(trx, { where: { id: volunteer.id } });
    expect(volunteerExists).toBeFalsy();

    const [visitorLogExists] = await trx('visit_log')
      .where({ visit_log_id: visitLog.id });
    expect(visitorLogExists).toBeFalsy();

    const volunteerLogExists = await VolunteerLogs.exists(trx, { where: { id: volunteerLog.id } });
    expect(volunteerLogExists).toBeFalsy();
  });
});

