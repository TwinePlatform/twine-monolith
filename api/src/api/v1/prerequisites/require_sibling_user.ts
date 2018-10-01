/*
 * "user_details-sibling" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an data
 * of a sibling at the same organisation.
 *
 * Conditions under which this is true for user X attemptying to access user Y's data:
 *
 * - User X is an VOLUNTEER_ADMIN for a community business for which user Y is a VOLUNTEER
 * - User X is a VOLUNTEER for a community business for which user Y is an ORG_ADMIN
 *   (note this use case is currently not needed)
 *
 * Assumptions:
 * - This route pre-requisite is run _AFTER_ the organisation in question
 *   is fetched and placed in the `pre` object under one of the following keys:
 *   > organisation
 *   > communityBusiness
 *
 * - requested user is passed as a params named userId
 * - accessing user's details and linked organisation are held in credentials
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
