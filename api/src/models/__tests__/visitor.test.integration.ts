import * as Knex from 'knex';
import { Dictionary, omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/factory';
import { Visitors } from '..';
import { getTrx } from '../../../tests/database';


describe('Visitor model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);
  const context: Dictionary<any> = {};

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    await getTrx(context, knex);
  });

  afterEach(async () => {
    await context.trx.rollback();
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
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const changeset = await factory.build('visitor');

      const visitor = await Visitors.add(context.trx, changeset);

      expect(visitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: non-foreign key column', async () => {
      const changeset = { email: 'newmail@foo.com' };
      const visitor = await Visitors.getOne(context.trx, { where: { id: 1 } });

      const updatedVisitor = await Visitors.update(context.trx, visitor, changeset);

      expect(updatedVisitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: foreign key column', async () => {
      const changeset = { disability: 'no' };
      const visitor = await Visitors.getOne(context.trx, { where: { id: 1 } });

      const updatedVisitor = await Visitors.update(context.trx, visitor, changeset);

      expect(updatedVisitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);

      const changeset = { gender: 'non-existent' };
      const visitor = await Visitors.getOne(context.trx, { where: { id: 1 } });

      try {
        await Visitors.update(context.trx, visitor, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const visitor = await Visitors.getOne(knex);

      const serialised = Visitors.serialise(visitor);

      expect(serialised).toEqual(omit(['password', 'qrCode'], visitor));
    });

    test('deserialise :: inverse of serialise', async () => {
      const visitor = await Visitors.getOne(knex);

      const unchanged = Visitors.deserialise(Visitors.serialise(visitor));

      expect(unchanged).toEqual(omit(['password', 'qrCode'], visitor));
    });
  });
});
