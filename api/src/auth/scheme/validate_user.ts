import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Users, User, Organisations, Organisation } from '../../models';
import { RoleEnum } from '../types';
import Roles from '../roles';
import Permissions from '../permissions';


type CreateScopeName = (a: {
  access_type: string,
  permission_entity: string,
  permission_level: string,
}) => string;

const createScopeName: CreateScopeName = ({
  access_type,
  permission_entity,
  permission_level,
}) =>
  `${permission_entity}-${permission_level}:${access_type}`;

type Credentials = {
  user: User
  organisation: Organisation
  role: RoleEnum
  scope: string []
};

type ValidateUser = (a: {userId: number, organisationId: number}, b: Hapi.Request)
  => Promise <{credentials?: Credentials, isValid: boolean } | Boom<null>>;

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
    const scope = permissions.map(createScopeName);

    return {
      credentials: {
        user,
        organisation,
        role,
        scope,
      },
      isValid: true,
    };

  } catch (error) {
    console.log(error);
    return Boom.badImplementation('Error with route authentication for users');
  }
};

export default validateUser;
