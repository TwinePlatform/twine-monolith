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
      role,
    ] = await Promise.all([
      Users.getOne(knex, { where: { id: userId, deletedAt: null } }),
      Organisations.getOne(knex, { where: { id: organisationId, deletedAt: null } }),
      Roles.oneFromUser(knex, { userId, organisationId }),
    ]);

    const permissions = await Permissions.forRole(knex, { role, accessMode: privilege });
    const scope = permissions.map(scopeToString);

    return {
      credentials: {
        user,
        organisation,
        role,
        scope,
        session: decoded,
      },
      isValid: Boolean(user && organisation && role),
    };

  } catch (error) {
    request.log('error', error);
    return Boom.badImplementation('Error with route authentication for users');
  }
};

export default validateUser;
