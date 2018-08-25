/*
 * "organisation_details-child" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an organisation
 * which is actually a "child" entity.
 *
 * Conditions under which this is true for organisation X:
 * - User is an admin for a funding body which owns at least
 *   one funding programme of which X is a member
 * - User is a Twine admin
 *
 */
import * as Hapi from 'hapi';
import { OrganisationRequest } from '../types';
import { RoleEnum } from '../../../auth/types';


export default async (request: OrganisationRequest, h: Hapi.ResponseToolkit) => {
  const { auth: { credentials: { role } } } = request;

  if (role === RoleEnum.TWINE_ADMIN) {
    return true;
  }

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120
  return false;
};
