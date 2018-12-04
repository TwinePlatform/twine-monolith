/*
 * "organisations_details-child" route pre-requisite
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
import { GetCommunityBusinessRequest } from '../types';
import { RoleEnum } from '../../../auth/types';
import { StandardCredentials } from '../../../auth/strategies/standard';


export default async (request: GetCommunityBusinessRequest, h: Hapi.ResponseToolkit) => {
  const { roles } = StandardCredentials.fromRequest(request);

  if (roles.includes(RoleEnum.TWINE_ADMIN)) {
    return true;
  }

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120
  return false;
};
