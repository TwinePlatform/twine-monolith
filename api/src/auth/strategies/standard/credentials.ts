import Roles from '../../../models/role';
import Permissions from '../../../models/permission';
import { scopeToString } from '../../scopes';
import { ICredentials } from './types';


export const Credentials: ICredentials = {
  async get (knex, user, org, session) {
    const roles = await Roles.fromUserWithOrg(knex, { userId: user.id, organisationId: org.id });
    const permissions = await Permissions.forRoles(knex, { roles });

    return {
      scope: permissions.map(scopeToString),
      user: {
        user,
        organisation: org,
        roles,
        session,
      },
    };
  },

  fromRequest (req) {
    return Object.assign({ scope: req.auth.credentials.scope }, req.auth.credentials.user);
  },
};
