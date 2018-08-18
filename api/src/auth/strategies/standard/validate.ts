import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users, User, Organisations, Organisation } from '../../../models';
import { RoleEnum } from '../../types';
import Roles from '../../roles';
import Permissions from '../../permissions';
import { scopeToString } from '../../scopes';


export type UserCredentials = {
  scope: string[]
  user?: User
  organisation?: Organisation
  role?: RoleEnum
};

type ValidateUser = (a: {userId: number, organisationId: number}, b: Hapi.Request)
  => Promise <{credentials?: UserCredentials, isValid: boolean } | Boom<null>>;

const validateUser: ValidateUser = async (decoded, request) => {
  try {
    const { knex } = request;
    const { userId, organisationId } = decoded;

    if (!userId || !organisationId) {
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

    const permissions = await Permissions.forRole(knex, { role });
    const scope = permissions.map(scopeToString);

    return {
      credentials: {
        user,
        organisation,
        role,
        scope,
      },
      isValid: Boolean(user && organisation && role),
    };

  } catch (error) {
    request.log('error', error);
    return Boom.badImplementation('Error with route authentication for users');
  }
};

export default validateUser;
