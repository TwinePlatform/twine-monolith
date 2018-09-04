import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Visitors, CommunityBusinesses } from '..';


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
      expect(visitors).toEqual([expect.objectContaining({ id: 1, name: 'Chell' })]);
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

    test('fromOrganisation :: gets all visitors at organisation', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { name: 'Aperture Science' } });
      const visitors = await Visitors.fromCommunityBusiness(knex, cb);
      expect(visitors).toHaveLength(1);
      expect(visitors[0]).toEqual(expect.objectContaining({ name: 'Chell' }));
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
      const changeset = { disability: 'no' };
      const visitor = await Visitors.getOne(trx, { where: { id: 1 } });

      const updatedVisitor = await Visitors.update(trx, visitor, changeset);

      expect(updatedVisitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);

      const changeset = { gender: 'non-existent' };
      const visitor = await Visitors.getOne(trx, { where: { id: 1 } });

      try {
        await Visitors.update(trx, visitor, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
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
