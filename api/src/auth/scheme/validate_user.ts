import * as Hapi from 'hapi';
import rolesInitialiser from '../roles';

type CreateScopeName = (a:{
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


type Credentials =  {
  userId: number,
  organisationId?: number,
  roleId: number
  scope: string []
};

type ValidateUser = (a:{userId:number}, b: Hapi.Request)
  => Promise <{credentials?: Credentials, isValid: boolean }>;

const validateUser:ValidateUser = async (decoded, request) => {
  const { userId } = decoded;
  const rolesInterface = rolesInitialiser(request.knex);
  const getRoleId = await rolesInterface.getUserRole({ userId });
  const roleId = getRoleId.access_role_id;

  const getPermissions = await rolesInterface.getRolePermissions({ roleId });
  const scope = getPermissions.map(createScopeName);
  if (userId) {
    return {
      credentials: {
        userId,
        roleId,
        scope,
      },
      isValid: true };
  }
  return { isValid: false };
};

export default validateUser;
