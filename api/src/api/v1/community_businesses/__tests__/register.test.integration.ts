import * as Hapi from 'hapi';
import * as Knex from 'knex';
import { init } from '../../../../server';
import { getConfig } from '../../../../../config';
import { Organisation, Organisations, User, Users, CommunityBusinesses } from '../../../../models';
import { getTrx } from '../../../../../tests/utils/database';
import { StandardCredentials } from '../../../../auth/strategies/standard';
import { RegionEnum, SectorEnum } from '../../../../models/types';
import { Roles, RoleEnum } from '../../../../auth';


describe('PUT /community-businesses', () => {
  let server: Hapi.Server;
  let knex: Knex;
  let trx: Knex.Transaction;

  let admin: User;
  let adminCreds: Hapi.AuthCredentials;
  let organisation: Organisation;
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

    organisation = await Organisations.getOne(knex, { where: { name: 'Aperture Science' } });
    admin = await Users.getOne(knex, { where: { name: 'Big Boss' } });
    adminCreds = await StandardCredentials.get(knex, admin, organisation);
  });

  afterAll(async () => {
    await server.shutdown(true);
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
    server.app.knex = trx;
  });

  afterEach(async () => {
    await trx.rollback();
    server.app.knex = knex;
  });

  describe('POST /community-businesses/register', () => {
    test('SUCCESS - create CB and admin user with successful payload', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/register',
        payload: {
          orgName: 'Stick House',
          region: RegionEnum.NORTH_EAST,
          sector: SectorEnum.HOUSING,
          postCode: 'I11 X11',
          _360GivingId: 'XOXOBO',
          adminName: 'Twiglet',
          adminEmail: 'twiggie@stick.house',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: expect.objectContaining({
          name: 'Stick House',
          sector: 'Housing',
        }),
      });

      const cbCheck = await CommunityBusinesses.getOne(trx, { where: { _360GivingId: 'XOXOBO' } });
      const userCheck = await Users.getOne(trx, { where: { email: 'twiggie@stick.house' } });
      const adminExists = await Roles.userHasAtCb(trx, {
        role: RoleEnum.CB_ADMIN,
        userId: (<any> userCheck).id,
        organisationId: (<any> cbCheck).id,
      });

      expect(adminExists).toBeTruthy();
    });

    test('FAILURE - return error for duplicate 360 giving id', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/register',
        payload: {
          orgName: 'Stick House',
          region: RegionEnum.NORTH_EAST,
          sector: SectorEnum.HOUSING,
          postCode: 'I11 X11',
          _360GivingId: organisation._360GivingId,
          adminName: 'Twiglet',
          adminEmail: 'twiggie@stick.house',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(400);
      expect((<any> res.result).error.message).toEqual('360 Giving Id already exists');
    });

    test('FAILURE - return error for duplicate email', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/register',
        payload: {
          orgName: 'Stick House',
          region: RegionEnum.NORTH_EAST,
          sector: SectorEnum.HOUSING,
          postCode: 'I11 X11',
          _360GivingId: 'hidingFromTheWolf',
          adminName: 'Twiglet',
          adminEmail: admin.email,
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(409);
      expect((<any> res.result).error.message).toEqual('User already exists with this email');
    });
  });

  describe('POST /community-businesses/register/temporary', () => {
    test('SUCCESS - create a temporary marked CB and admin user', async () => {
      const res = await server.inject({
        method: 'POST',
        url: '/v1/community-businesses/register/temporary',
        payload: {
          orgName: 'Stick House',
        },
        credentials: adminCreds,
      });

      expect(res.statusCode).toBe(200);
      expect(res.result).toEqual({
        result: {
          communityBusiness: expect.objectContaining({
            name: 'TEMPORARY ACCOUNT: Stick House',
            sector: 'TEMPORARY DATA',
          }),
          cbAdmin: expect.objectContaining({
            name: 'TEMPORARY ADMIN USER',
          }),
        },
      });
    });
  });
});
