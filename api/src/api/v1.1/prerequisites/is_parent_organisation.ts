/*
 * "organisations_details-parent" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an organisation
 * which is actually a "parent" entity.
 *
 * Conditions under which this is true for organisation X:
 * - User is a visitor for X
 * - User is a volunteer for X
 *
 * Assumptions:
 * - This route pre-requisite is run _AFTER_ the organisation in question
 *   is fetched and placed in the `pre` object under one of the following keys:
 *   > organisation
 *   > communityBusiness
 */
import * as Hapi from '@hapi/hapi';
import { Organisation, CommunityBusiness } from '../../../models';
import getOrganisation from './get_organisation';
import Roles from '../../../models/role';
import { Credentials as StandardCredentials } from '../../../auth/strategies/standard';
import { RoleEnum } from '../../../models/types';


interface Request extends Hapi.Request {
  params: { organisationId?: string };
}

const getOrg = async (request: Request, h: Hapi.ResponseToolkit) => {
  const { pre } = request;

  if ('organisation' in pre) {
    return pre.organisation as Organisation;
  }

  if ('communityBusiness' in pre) {
    return pre.communityBusiness as CommunityBusiness;
  }

  // Fallback case: manually fetch organisation if not already cached.
  return getOrganisation(request, h);
};

export default async (request: Request, h: Hapi.ResponseToolkit) => {
  const { server: { app: { knex } } } = request;
  const { user } = StandardCredentials.fromRequest(request);

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120
  const org = await getOrg(request, h);

  const isVolunteer = await Roles.userHasAtCb(knex, {
    role: RoleEnum.VOLUNTEER,
    userId: user.id,
    organisationId: org.id,
  });

  if (isVolunteer) {
    return isVolunteer;
  }

  const isVisitor = await Roles.userHasAtCb(knex, {
    role: RoleEnum.VISITOR,
    userId: user.id,
    organisationId: org.id,
  });

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120

  return isVisitor;
};
