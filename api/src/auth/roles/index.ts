import { RoleEnum, RolesInterface } from '../types';


const Roles: RolesInterface = {
  add: async (client, { role, userId, organisationId }) => {
    try {
      const [result] = await client.insert({
        user_account_id: userId,
        organisation_id: organisationId,
        access_role_id: client.select('access_role_id')
          .table('access_role')
          .where({ ['access_role_name']: role }),
      })
      .into('user_account_access_role')
      .returning('*');

      return result;

    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new Error(
            `Constraint violation: ${error.constraint}\n` +
            `Tried to associate User ${userId} with role ${role} ` +
            `at organistion ${organisationId}`
          );

        case '23503':
          throw new Error(`Foreign key does not exist: ${error.detail}`);

        /* istanbul ignore next */
        default:
          throw error;
      }
    }
  },

  remove: async (client, { role, userId, organisationId }) => {
    const deleteRow = await client('user_account_access_role')
      .where({
        user_account_id: userId,
        organisation_id: organisationId,
        access_role_id: client.select('access_role_id')
          .table('access_role')
          .where({ ['access_role_name']: role }),
      })
      .del()
      .returning('*');

    if (deleteRow.length === 0) {
      throw new Error(
        `User ${userId} is not associated with role ${role} at organisation ${organisationId}`
      );
    }
    return deleteRow[0];
  },

  move: async (client, { to, from , userId, organisationId }) => {
    const userHasSourceRole = await Roles.userHas(client, { role: from, userId, organisationId });

    if (! userHasSourceRole) {
      throw new Error(`"from" role ${from} is not associated with user ${userId}`);
    }

    try {
      return await client.transaction((trx) =>
        Roles.remove(trx, { role: from, userId, organisationId })
          .then(() => Roles.add(trx, { role: to, userId, organisationId }))
          .then(trx.commit)
          .catch(trx.rollback)
      );
    } catch (error) {
      switch (error.code) {
        case '23505':
          throw new Error(
            `User ${userId} is already associated with ` +
            `role ${from} at organistion ${organisationId}`
          );

        /* istanbul ignore next */
        default:
          throw error;
      }
    }
  },

  userHas: async (client, { role, userId, organisationId }) => {
    const sub = Array.isArray(role)
      ? client('access_role') .select('access_role_id') .whereIn('access_role_name', role)
      : client('access_role').select('access_role_id').where({ access_role_name: role });

    const inner = client('user_account_access_role')
      .select()
      .where({
        user_account_id: userId,
        organisation_id: organisationId,
      })
      .whereIn('access_role_id', sub);

    const { rows } = await client.raw('SELECT EXISTS ?', [inner]);
    return rows[0].exists;
  },

  fromUser: async (client, { userId, organisationId }) => {
    const result = await client('access_role')
      .select('access_role_name')
      .whereIn(
        'access_role_id',
        client('user_account_access_role')
          .select('access_role_id')
          .where({
            user_account_id: userId,
            organisation_id: organisationId,
          })
      )
      .orderBy('access_role_name', 'asc');

    return result.map((row: any) => row.access_role_name) as RoleEnum[];
  },
};

export default Roles;
