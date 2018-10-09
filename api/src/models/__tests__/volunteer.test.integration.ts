import * as Knex from 'knex';
import { omit } from 'ramda';
import { getConfig } from '../../../config';
import factory from '../../../tests/utils/factory';
import { getTrx } from '../../../tests/utils/database';
import { Volunteers, DisabilityEnum, Users } from '..';
import { CommunityBusinesses } from '../community_business';
import { RoleEnum } from '../../auth/types';
import Roles from '../../auth/roles';

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

    test('adminCodeIsValid :: returns true for matching code & cb', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { name: 'Black Mesa Research' } });
      const isValid = await Volunteers.adminCodeIsValid(knex, cb, '70007');

      expect(isValid).toBe(true);
    });

    test('adminCodeIsValid :: returns false for not matching code & cb', async () => {
      const cb = await CommunityBusinesses.getOne(knex, { where: { name: 'Black Mesa Research' } });
      const isValid = await Volunteers.adminCodeIsValid(knex, cb, '10000');

      expect(isValid).toBe(false);
    });
  });

  describe('Write', () => {
    test('add :: create new record using minimal information', async () => {
      const changeset = await factory.build('volunteer');
      const volunteer = await Volunteers.add(trx, changeset);

      expect(volunteer).toEqual(expect.objectContaining(changeset));
    });

    test('addWithRole :: create new VOLUNTEER record', async () => {
      const changeset = await factory.build('volunteer');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });
      const volunteer = await Volunteers.addWithRole(trx, changeset, RoleEnum.VOLUNTEER, cb);
      const rolesCheck = await Roles
       .userHas(trx, { role: RoleEnum.VOLUNTEER, userId: volunteer.id, organisationId: cb.id });
      expect(volunteer).toEqual(expect.objectContaining(changeset));
      expect(rolesCheck).toBeTruthy();
    });

    test('addWithRole :: create new VOLUNTEER_ADMIN record', async () => {
      const changeset = await factory.build('volunteer');
      const cb = await CommunityBusinesses.getOne(trx, { where: { name: 'Black Mesa Research' } });

      const volunteerAdmin = await Volunteers
        .addWithRole(trx, changeset, RoleEnum.VOLUNTEER_ADMIN, cb);

      const rolesCheck = await Roles.userHas(trx, {
        role: RoleEnum.VOLUNTEER_ADMIN,
        userId: volunteerAdmin.id,
        organisationId: cb.id,
      });

      expect(volunteerAdmin).toEqual(expect.objectContaining(changeset));
      expect(rolesCheck).toBeTruthy();
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

    test('update :: failed as not a volunteer user', async () => {
      expect.assertions(2);

      const changeset = <any> { gender: 'non-existent' };
      const volunteer = await Users.getOne(trx, { where: { id: 1 } });

      try {
        await Volunteers.update(trx, volunteer, changeset);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('User is not a volunteer');
      }
    });

    test('destroy :: soft delete volunteer', async () => {
      const volunteer = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const deletedRows = await Volunteers.destroy(trx, volunteer);
      const userCheck = await Users.getOne(trx, { where: { name: 'Emma Emmerich' } });
      const userCheck2 = await Users.getOne(trx, { where: { id: 6 } });

      expect(deletedRows).toBe(1);
      expect(userCheck).toBe(null);
      expect(userCheck2).toEqual(expect.objectContaining({
        birthYear: 1996,
        disability: 'yes',
        email: null,
        ethnicity: 'prefer not to say',
        gender: 'female',
        id: 6,
        name: 'none',
        phoneNumber: null,
        postCode: null,
      }));
      expect(userCheck2.deletedAt).toBeTruthy();
    });

    test('destroy :: failed as not a volunteer user', async () => {
      expect.assertions(2);
      const volunteer = await Users.getOne(trx, { where: { id: 1 } });

      try {
        await Volunteers.destroy(trx, volunteer);
      } catch (error) {
        expect(error).toBeTruthy();
        expect(error.message).toBe('User is not a volunteer');
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
