import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Visitors, DisabilityEnum } from '..';
import { CommunityBusinesses } from '../community_business';
import Roles from '../../auth/roles';
import { RoleEnum } from '../../auth/types';


describe('Visitor model', () => {
  let trx: Knex.Transaction;
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  describe('Read', () => {
    test('get :: returns only those users with a visitor role', async () => {
      const visitors = await Visitors.get(knex);
      expect(visitors).toEqual([
        expect.objectContaining({ id: 1, name: 'Chell' }),
        expect.objectContaining({ id: 8, name: 'Turret' }),
        expect.objectContaining({ id: 9, name: 'Companion Cube' }),
      ]);
    });

    test('get :: no deleted users', async () => {
      const visitors = await Visitors.get(knex, { whereNot: { deletedAt: null } });
      expect(visitors).toEqual([]);
    });

    test('getOne :: returns first user with visitor role', async () => {
      const visitor = await Visitors.getOne(knex);
      expect(visitor).toEqual(expect.objectContaining({ id: 1, name: 'Chell' }));
    });

    test('exists :: returns true for existent visitor', async () => {
      const exists = await Visitors.exists(knex, { where: { name: 'Chell' } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent visitor', async () => {
      const exists = await Visitors.exists(knex, { where: { name: 'Gordon' } });
      expect(exists).toBe(false);
    });

    test('fromCommunityBusiness :: gets all visitors at organisation', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { name: 'Aperture Science' } });
      const visitors = await Visitors.fromCommunityBusiness(knex, cb);
      expect(visitors).toHaveLength(3);
      expect(visitors[0]).toEqual(expect.objectContaining({ name: 'Chell' }));
    });

    test('fromCommunityBusiness :: can filter fields', async () => {
      const cb =
        await CommunityBusinesses.getOne(knex, { where: { name: 'Aperture Science' } });
      const visitors =
        await Visitors.fromCommunityBusiness(knex, cb, { fields: ['name', 'qrCode'] });

      expect(visitors).toHaveLength(3);
      expect(visitors[0]).toEqual({ name: 'Chell', qrCode: 'chellsqrcode' });
    });

    test('fromCommunityBusiness :: can filter by birth year', async () => {
      const cb =
        await CommunityBusinesses.getOne(knex, { where: { name: 'Aperture Science' } });
      const visitors = await Visitors.fromCommunityBusiness(
        knex,
        cb,
        { fields: ['id', 'name'], whereBetween: { birthYear: [24, 45] } }
      );

      expect(visitors).toHaveLength(1);
      expect(visitors).toEqual(expect.arrayContaining([
        { id: 1, name: 'Chell' },
      ]));
    });

    test('getWithVisits :: returns visit objects nested within visitors', async () => {
      const apScience = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });
      const visitors = await Visitors.getWithVisits(knex, apScience, { where: { name: 'Chell' } });
      expect(visitors).toHaveLength(1);
      expect(visitors[0]).toEqual(expect.objectContaining({ id: 1, name: 'Chell' }));
      expect(visitors[0].visits).toHaveLength(10);
      expect(visitors[0].visits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ visitActivity: 'Free Running' }),
        ])
      );
    });

    test('getWithVisits :: returns visitor object even if no visits', async () => {
      // Grab organisation under test
      const apScience = await CommunityBusinesses.getOne(trx, { where: { id: 1 } });

      // Add new visitor to organisation
      const visitor = await Visitors.add(
        trx,
        Visitors.create({ email: 'foo@bar.com', name: 'jim' })
      );
      await Roles.add(trx, { role: RoleEnum.VISITOR, organisationId: 1, userId: visitor.id });

      // Execute
      const visitors = await Visitors.getWithVisits(trx, apScience);

      // Assert
      expect(visitors).toHaveLength(4);
      expect(visitors[0]).toEqual(expect.objectContaining({ id: 1, name: 'Chell' }));
      expect(visitors[0].visits).toHaveLength(10);
      expect(visitors[0].visits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ visitActivity: 'Free Running' }),
        ])
      );
      expect(visitors[3]).toEqual({ ...visitor, visits: [] });
    });

    test('getWithVisits :: third argument filters by activity name', async () => {
      const apScience = await CommunityBusinesses.getOne(knex, { where: { id: 1 } });
      const visitors = await Visitors.getWithVisits(
        knex, apScience, { where: { name: 'Chell' } }, 'Free Running');
      expect(visitors).toHaveLength(1);
      expect(visitors[0]).toEqual(expect.objectContaining({ id: 1, name: 'Chell' }));
      expect(visitors[0].visits).toHaveLength(7);
      expect(visitors[0].visits.every((v) => v.visitActivity === 'Free Running')).toBe(true);
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const changeset = await factory.build('visitor');

      const visitor = await Visitors.add(trx, changeset);

      expect(visitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: non-foreign key column', async () => {
      const changeset = { email: 'newmail@foo.com' };
      const visitor = await Visitors.getOne(trx, { where: { id: 1 } });

      const updatedVisitor = await Visitors.update(trx, visitor, changeset);

      expect(updatedVisitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: foreign key column', async () => {
      const changeset = { disability: DisabilityEnum.NO };
      const visitor = await Visitors.getOne(trx, { where: { id: 1 } });

      const updatedVisitor = await Visitors.update(trx, visitor, changeset);

      expect(updatedVisitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);

      const changeset = <any> { gender: 'non-existent' };
      const visitor = await Visitors.getOne(trx, { where: { id: 1 } });

      try {
        await Visitors.update(trx, visitor, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('addWithRole :: creates a new user with role', async () => {
      const changeset = await factory.build('visitor');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const visitor = await Visitors.addWithRole(trx, cb, changeset);
      const rolesCheck = await Roles
       .userHas(trx, { role: RoleEnum.VISITOR, userId: visitor.id, organisationId: cb.id });
      expect(visitor).toEqual(expect.objectContaining(changeset));
      expect(rolesCheck).toBeTruthy();
    });

    test('addAnonymousWithRole :: creates a new anonymous user with role', async () => {
      const changeset = await factory.build('visitor');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const visitor = await Visitors.addAnonymousWithRole(trx, cb, changeset);
      const emailCheck = /anon_\d*_org_\d*/.test(visitor.email);
      const rolesCheck = await Roles
       .userHas(trx, { role: RoleEnum.VISITOR, userId: visitor.id, organisationId: cb.id });
      expect(visitor).toEqual(expect.objectContaining(omit(['email'], changeset)));
      expect(emailCheck).toBeTruthy();
      expect(rolesCheck).toBeTruthy();
    });

    test('addAnonymousWithRole :: increments counter in faux email', async () => {
      const changeset = await factory.build('visitor');
      const changeset2 = await factory.build('visitor');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const visitor = await Visitors.addAnonymousWithRole(trx, cb, changeset);
      const visitor2 = await Visitors.addAnonymousWithRole(trx, cb, changeset2);
      expect(visitor.email).toBe('anon_0_org_2');
      expect(visitor2.email).toBe('anon_1_org_2');
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const visitor = await Visitors.getOne(knex);

      const serialised = await Visitors.serialise(visitor);

      const { qrCode: qrCodeOriginal, ...restVisitorOriginal } = visitor;
      const { qrCode: qrCodeSerialised, ...restVisitorSerialised } = <any> serialised;

      expect(restVisitorSerialised).toEqual(omit(['password'], restVisitorOriginal));
      expect(qrCodeOriginal).not.toEqual(qrCodeSerialised);
    });
  });
});
