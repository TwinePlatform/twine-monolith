import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users, Organisations } from '../../../models';
import Roles from '../../roles';
import Permissions from '../../permissions';
import { scopeToString } from '../../scopes';
import { ValidateUser, TCredentials } from './types';


export const StandardCredentials: TCredentials = {
  async get (knex, user, organisation, session) {
    const roles = await Roles.fromUserWithOrg(
      knex,
      { userId: user.id, organisationId: organisation.id });
    const permissions = await Permissions.forRoles(knex, { roles });

    return {
      scope: permissions.map(scopeToString),
      user: {
        user,
        organisation,
        roles,
        session,
      },
    };
  },

  fromRequest (request: Hapi.Request) {
    return { ...request.auth.credentials.user, scope: request.auth.credentials.scope };
  },
};


const validateUser: ValidateUser = async (decoded, request) => {
  try {
    const { server: { app: { knex } } } = request;
    const { userId, organisationId } = decoded;

    if (!userId || !organisationId) {
      return { isValid: false };
    }

    const [
      user,
      organisation,
      roles,
    ] = await Promise.all([
      Users.getOne(knex, { where: { id: userId, deletedAt: null } }),
      Organisations.getOne(knex, { where: { id: organisationId, deletedAt: null } }),
      Roles.fromUserWithOrg(knex, { userId, organisationId }),
    ]);

    return {
      credentials: await StandardCredentials.get(knex, user, organisation, decoded),
      isValid: Boolean(user && organisation && roles.length > 0),
    };

  } catch (error) {
    request.log('error', error);
    return Boom.badImplementation('Error with route authentication for users');
  }
};

export default validateUser;
