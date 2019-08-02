import * as Knex from 'knex';
import { getConfig } from '../../../config';
import { getTrx } from '../../../tests/utils/database';
import { ApiTokens } from '../apiToken';

describe('API Tokens Model', () => {
  const config = getConfig(process.env.NODE_ENV);
  const knex = Knex(config.knex);
  let trx: Knex.Transaction;

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    trx = await getTrx(knex);
  });

  afterEach(async () => {
    await trx.rollback();
  });

  describe('find', () => {
    test('can find token that exists', async () => {
      const token = await ApiTokens.find(trx, 'aperture-token');
      expect(token).toEqual(expect.objectContaining({
        name: 'Aperture Science',
        access: 'api:visitor:read',
        id: 3,
        modifiedAt: null,
        deletedAt: null,
      }));
    });

    test('rejects if token cannot be found', async () => {
      expect.assertions(1);

      try {
        await ApiTokens.find(trx, 'does not exist');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });

    test('does not return tokens marked as deleted', async () => {
      expect.assertions(2);

      const res = await trx('api_token')
        .update({ deleted_at: new Date() })
        .where({ api_token_name: 'Aperture Science' });

      expect(res).toBe(1);

      try {
        await ApiTokens.find(trx, 'aperture-token');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('create', () => {
    test('creates ApiToken object with random token', () => {
      const token = ApiTokens.create('foo', 'bar');

      expect(token).toEqual(expect.objectContaining({
        name: 'foo',
        access: 'bar',
        token: expect.stringContaining(''),
      }));
      expect(token.token).toHaveLength(32);
    });
  });

  describe('add', () => {
    test('adds created token to api_token table', async () => {
      const tknsBefore = await trx('api_token').select('*');

      const rawToken = await ApiTokens.create('foo', 'bar');
      const token = await ApiTokens.add(trx, rawToken);
      const found = await ApiTokens.find(trx, rawToken.token);

      const tknsAfter = await trx('api_token').select('*');

      expect(token).toEqual(expect.objectContaining({
        id: tknsBefore.length + 1,
        name: 'foo',
        access: 'bar',
        token: expect.stringContaining(''),
        modifiedAt: null,
        deletedAt: null,
      }));
      expect(found).toEqual(token);
      expect(tknsBefore).toHaveLength(tknsAfter.length - 1);
    });
  });

  describe('delete', () => {
    test('marks token as deleted', async () => {
      expect.assertions(2);

      const token = await ApiTokens.find(trx, 'blackmesa-token');
      const res = await ApiTokens.delete(trx, token);

      expect(res).toEqual(1);

      try {
        await ApiTokens.find(trx, 'blackmesa-token');
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });
});
