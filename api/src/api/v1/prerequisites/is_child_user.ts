/*
 * "user_details-child" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an user
 * which is actually a "child" entity.
 *
 * Conditions under which this is true for user X attemptying to access:
 * user Y
 * - User X is an admin for a community business for which user Y is a VISITOR
 * - User X is an admin for a community business for which user Y is a VOLUNTEER
 * - User X is a Twine admin
 *
 * NOTE: Funding body admins should not be allowed to access user information of
 *       VISITOR or VOLUNTEER users at child community-businesses for GDPR reasons
 */
import * as Hapi from '@hapi/hapi';
import { PutUserRequest } from '../types';
import Roles from '../../../models/role';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { RoleEnum } from '../../../models/types';
import { ExternalCredentials } from '../../../auth/strategies/external';


export default async (request: PutUserRequest, h: Hapi.ResponseToolkit) => {
  const {
    server: { app: { knex } },
    params: { userId },
  } = request;

  if (request.auth.strategy === 'external') {
    const { organisation } = ExternalCredentials.fromRequest(request);

    return Roles.userHasAtCb(knex, {
      role: [RoleEnum.VISITOR, RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
      userId: Number(userId),
      organisationId: organisation.id,
    });
  }

  const { user, roles, organisation } = StandardCredentials.fromRequest(request);

  if (roles.includes(RoleEnum.TWINE_ADMIN)) {
    return true;
  }

  const [isOrgAdmin, targetIsVisitorOrVolunteer] =
    await Promise.all([
      Roles.userHasAtCb(knex, {
        role: RoleEnum.CB_ADMIN,
        userId: user.id,
        organisationId: organisation.id,
      }),

      Roles.userHasAtCb(knex, {
        role: [RoleEnum.VISITOR, RoleEnum.VOLUNTEER, RoleEnum.VOLUNTEER_ADMIN],
        userId: Number(userId),
        organisationId: organisation.id,
      }),
    ]);

  return isOrgAdmin && targetIsVisitorOrVolunteer;
};
