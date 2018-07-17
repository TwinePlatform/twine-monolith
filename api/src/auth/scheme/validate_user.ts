import * as Hapi from 'hapi';
import * as Boom from 'boom';
import rolesInitialiser from '../roles';
import permissionsInitialiser from '../permissions';

type CreateScopeName = (a: {
  access_type: string,
  permission_entity: string,
  permission_level: string
}) => string;

const createScopeName: CreateScopeName = ({
  access_type,
  permission_entity,
  permission_level,
}) =>
  `${permission_entity}-${permission_level}:${access_type}`;


type Credentials = {
  userId: number,
  organisationId?: number,
  roleId: number
  scope: string []
};

type ValidateUser = (a: {userId: number, organisationId: number}, b: Hapi.Request)
  => Promise <{credentials?: Credentials, isValid: boolean } | Boom<null>>;

const validateUser: ValidateUser = async (decoded, request) => {
  try {

    const { userId, organisationId } = decoded;
    if (userId && organisationId) {

      const rolesInterface = rolesInitialiser(request.knex);
      const permissionsInterface = permissionsInitialiser(request.knex);
      const getRoleId = await rolesInterface.getUserRole({ userId, organisationId });
      const roleId = getRoleId.access_role_id;

      const getPermissions = await permissionsInterface.permissionsForRole({ roleId });
      const scope = getPermissions.map(createScopeName);
      return {
        credentials: {
          userId,
          roleId,
          scope,
        },
        isValid: true };
    }
    return { isValid: false };
  } catch (error) {
    console.log(error);
    return Boom.badImplementation('Error with server authentication');
  }
};

export default validateUser;
