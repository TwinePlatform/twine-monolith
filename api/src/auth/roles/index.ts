import { RolesInitialiser } from './types';
import { lazyPromiseSeries } from '../../utils';


const rolesInitialiser: RolesInitialiser = (client) => {
  return {
    add: async ({ role, userId, organisationId }) => {
      try {
        const query = await client.insert({
          user_account_id: userId,
          organisation_id: organisationId,
          access_role_id: client.select('access_role_id')
            .table('access_role')
            .where({ ['access_role_name']: role }),
        })
        .into('user_account_access_role')
        .returning('*');

        return query[0];

      } catch (error) {
        switch (error.code){
          case '23505':
            throw new Error('User is already associated with this role at this organistion');

          case '23503':
            throw new Error(`Foreign key does not exist: ${error.detail}`);

          default:
            throw error;
        }
      }
    },

    remove: async ({ role, userId, organisationId }) => {
      const deleteRow = await client('user_account_access_role')
        .where({ user_account_id: userId,
          organisation_id: organisationId,
          access_role_id: client.select('access_role_id')
            .table('access_role')
            .where({ ['access_role_name']: role }),
        })
        .del()
        .returning('*');

      if (deleteRow.length === 0) {
        throw new Error('This user is not associated to this role at this organisation');
      }
      return deleteRow[0];
    },

    move: async ({ to, from , userId, organisationId }) => {
      const inner = client('user_account_access_role')
        .select()
        .where({
          user_account_id: userId,
          organisation_id: organisationId,
          access_role_id: client('access_role')
            .select('access_role_id').where({ access_role_name: from }),
        });

      const checkFromExists = await client.raw('SELECT EXISTS ?', [inner]);

      if (!checkFromExists.rows[0].exists) {
        throw new Error(`From role is not associated associated to this user`);
      }

      const deleteRow = client('user_account_access_role')
        .where({ user_account_id: userId,
          organisation_id: organisationId,
          access_role_id: client.select('access_role_id')
            .table('access_role')
            .where({ ['access_role_name']: from }),
        })
        .del();

      const addRow = client.insert({
        user_account_id: userId,
        organisation_id: organisationId,
        access_role_id: client.select('access_role_id')
          .table('access_role')
          .where({ ['access_role_name']: to }),
      })
      .into('user_account_access_role');

      try {
        return await client.transaction((trx) =>
          lazyPromiseSeries([deleteRow, addRow].map((q) => q.transacting(trx)))
            .then(trx.commit)
            .catch(trx.rollback)
        );
      } catch (error) {
        switch (error.code) {
          case '23505':
            throw new Error(
              'User is already associated with this \'from\' role at this organistion');

          default:
            throw error;
        }
      }
    },

    removeUserFromAll: async ({ userId, organisationId }) => {
      const deleteRow = await client('user_account_access_role')
        .where({
          user_account_id: userId,
          organisation_id: organisationId,
        })
        .del()
        .returning('*');

      if (deleteRow.length === 0) {
        throw new Error('This user is not associated to any roles at this organisation');
      }
      return deleteRow;
    },

    userHas: async ({ role, userId, organisationId }) => {
      const inner = client('user_account_access_role')
        .select()
        .where({
          user_account_id: userId,
          organisation_id: organisationId,
          access_role_id: client('access_role')
            .select('access_role_id')
            .where({ access_role_name: role }),
        });
      const result = await client.raw('SELECT EXISTS ?', [inner]);
      return result.rows[0];
    },
    getUserRole: async({ userId, organisationId }) => {
      const query = await client('user_account_access_role')
        .select('access_role_id')
        .where({ user_account_id: userId, organisation_id: organisationId });
      if (query.length === 0) {
        throw new Error('User does not exist');
      }
      return query[0];
    },
    getRolePermissions: async({ roleId }) => {
      const query = await client('permission')
       .innerJoin(
        'access_role_permission',
        'permission.permission_id',
        'access_role_permission.permission_id')
      .select()
      .where({ 'access_role_permission.access_role_id': roleId });

      if (query.length === 0) {
        throw new Error('Role does not exist or has no associated permissions');
      }
      return query;

    },
  };
};

export default rolesInitialiser;
