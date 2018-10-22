/*
 * "user_details-sibling" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an data
 * of a sibling at the same organisation.
 *
 * Conditions under which this is true for user X attemptying to access user Y's data:
 *
 * - User X is an VOLUNTEER_ADMIN for a community business for which user Y is a VOLUNTEER
 * - User X is a VOLUNTEER for a community business for which user Y is an CB_ADMIN
 *   (note this use case is currently not needed)
 *
 * Assumptions:
 * - requested user is passed as a params named userId
 * - accessing user's details and linked organisation are held in credentials
 *
 * Current Uses:
 * This prereq is currently used in conjuntion with "user_details-sibling" for VOLUNTEER_ADMIN
 * to access details of VOLUNTEERs and other VOLUNTEER_ADMINs at the same organisation.
 * This works by:
 * - linking `user_details-sibling:...` scopes to VOLUNTEER_ADMIN
 * - using this prereq to check that VOLUNTEER_ADMIN are at the same org as the target user
 *   (without this check VOLUNTEER_ADMINs would be able to check for users at other orgs)
 * - VOLUNTEERs & VISITORs will pass this check but cannot access these routes as they
 *   do not have the correct scope
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Organisations } from '../../../models';
import { RequireSiblingPreReq } from '../types';
import { RoleEnum } from '../../../auth/types';

export default async (request: RequireSiblingPreReq, h: Hapi.ResponseToolkit) => {
  const {
    auth: { credentials: { organisation, role } },
    server: { app: { knex } },
    params: { userId },
  } = request;

  if (role === RoleEnum.TWINE_ADMIN) {
    return true;
  }

  const requestedUsersOrganisation =
    await Organisations.fromUser(knex, { where: { id: Number(userId) } });

  if (requestedUsersOrganisation.id === organisation.id) {
    return true;
  }
  return Boom.unauthorized('Trying to access a user from another organisation');
};
