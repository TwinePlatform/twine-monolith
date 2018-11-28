import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users, Organisations } from '../../../models';
import Roles from '../../roles';
import Permissions from '../../permissions';
import { scopeToString } from '../../scopes';
import { Session, UserCredentials } from './types';


type ValidateUser = (a: Session, b: Hapi.Request)
  => Promise <{credentials?: UserCredentials, isValid: boolean } | Boom<null>>;

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

    const permissions = await Permissions.forRoles(knex, { roles, accessMode: privilege });
    const scope = permissions.map(scopeToString);

    return {
      credentials: {
        user,
        organisation,
        roles,
        scope,
        session: decoded,
      },
      isValid: Boolean(user && organisation && roles.length > 0),
    };

  } catch (error) {
    request.log('error', error);
    return Boom.badImplementation('Error with route authentication for users');
  }
};

export default validateUser;
