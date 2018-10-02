import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Volunteers, DisabilityEnum } from '..';
import { CommunityBusinesses } from '../community_business';

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
    test('get :: returns only those users with a volunteer type role', async () => {
      const volunteers = await Volunteers.get(knex);
      expect(volunteers).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 6, name: 'Emma Emmerich' }),
      ]));
    });

    test('get :: no deleted volunteers', async () => {
      const volunteers = await Volunteers.get(knex, { whereNot: { deletedAt: null } });
      expect(volunteers).toEqual([]);
    });

    test('getOne :: returns first user with volunteer role', async () => {
      const volunteer = await Volunteers.getOne(knex);
      expect(volunteer).toEqual(expect.objectContaining({ id: 6, name: 'Emma Emmerich' }));
    });

    test('exists :: returns true for existent volunteer', async () => {
      const exists = await Volunteers.exists(knex, { where: { name: 'Emma Emmerich' } });
      expect(exists).toBe(true);
    });

    test('exists :: returns false for non-existent volunteer', async () => {
      const exists = await Volunteers.exists(knex, { where: { name: 'Gordon' } });
      expect(exists).toBe(false);
    });

    test('fromCommunityBusiness :: gets all volunteers at organisation', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { name: 'Black Mesa Research' } });
      const volunteers = await Volunteers.fromCommunityBusiness(knex, cb);

      expect(volunteers).toHaveLength(2);
      expect(volunteers[0]).toEqual(expect.objectContaining({ name: 'Emma Emmerich' }));
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const changeset = await factory.build('volunteer');
      const volunteer = await Volunteers.add(trx, changeset);

      expect(volunteer).toEqual(expect.objectContaining(changeset));
    });

    test('update :: non-foreign key column', async () => {
      const changeset = { email: 'newmail@foo.com' };
      const volunteer = await Volunteers.getOne(trx, { where: { id: 6 } });

      const updatedVolunteer = await Volunteers.update(trx, volunteer, changeset);

      expect(updatedVolunteer).toEqual(expect.objectContaining(changeset));
    });

    test('update :: foreign key column', async () => {
      const changeset = { disability: DisabilityEnum.NO };
      const volunteer = await Volunteers.getOne(trx, { where: { id: 6 } });

      const updatedVisitor = await Volunteers.update(trx, volunteer, changeset);

      expect(updatedVisitor).toEqual(expect.objectContaining(changeset));
    });

    test('update :: failed update on foreign key column', async () => {
      expect.assertions(1);

      const changeset = <any> { gender: 'non-existent' };
      const volunteer = await Volunteers.getOne(trx, { where: { id: 6 } });

      try {
        await Volunteers.update(trx, volunteer, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
      }
    });
  });

  describe('Serialisation', () => {
    test('serialise :: returns model object without secrets', async () => {
      const volunteer = await Volunteers.getOne(knex);
      const serialised = await Volunteers.serialise(volunteer);

      expect(serialised).toEqual(omit(['password', 'qrCode'], volunteer));
    });
  });
});
