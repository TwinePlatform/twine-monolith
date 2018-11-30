import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as Knex from 'knex';
import { Users, Organisations, User, Organisation } from '../../../models';
import Roles from '../../roles';
import Permissions from '../../permissions';
import { scopeToString } from '../../scopes';
import { Session, StandardCredentials } from './types';


type ValidateUser = (a: Session, b: Hapi.Request) =>
  Promise <{credentials?: Hapi.AuthCredentials, isValid: boolean } | Boom<null>>;

type TCredentials = {
  get: (k: Knex, u: User, o: Organisation, privilege?: 'full' | 'restricted', s?: Session) =>
    Promise<Hapi.AuthCredentials>

  fromRequest: (r: Hapi.Request) =>
    StandardCredentials & { scope: string[] }
};

export const Credentials: TCredentials = {
  async get (knex, user, organisation, privilege = 'full', session) {
    const roles = await Roles.fromUser(knex, { userId: user.id, organisationId: organisation.id });
    const permissions = await Permissions.forRoles(knex, { roles, accessMode: privilege });

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
    const { userId, organisationId, privilege } = decoded;

    if (!userId || !organisationId || !privilege) {
      return { isValid: false };
    }

    const [
      user,
      organisation,
      roles,
    ] = await Promise.all([
      Users.getOne(knex, { where: { id: userId, deletedAt: null } }),
      Organisations.getOne(knex, { where: { id: organisationId, deletedAt: null } }),
      Roles.fromUser(knex, { userId, organisationId }),
    ]);

    return {
      credentials: await Credentials.get(knex, user, organisation, privilege, decoded),
      isValid: Boolean(user && organisation && roles.length > 0),
    };

  } catch (error) {
    request.log('error', error);
    return Boom.badImplementation('Error with route authentication for users');
  }
};

export default validateUser;
