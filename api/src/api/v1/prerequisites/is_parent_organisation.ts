/*
 * "organisations_details-parent" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an organisation
 * which is actually a "parent" entity.
 *
 * Conditions under which this is true for organisation X:
 * - User is a visitor for X
 * - User is a volunteer for X
 * - User is a admin for a community business which is owned by organisation
 *   (funding-body) X
 *
 * Assumptions:
 * - This route pre-requisite is run _AFTER_ the organisation in question
 *   is fetched and placed in the `pre` object under one of the following keys:
 *   > organisation
 *   > communityBusiness
 *   > fundingBody
 */
import * as Hapi from 'hapi';
import { Organisation, CommunityBusiness } from '../../../models';
import { GetCommunityBusinessRequest } from '../types';
import getOrganisation from './get_organisation';
import { RoleEnum } from '../../../auth/types';
import Roles from '../../../auth/roles';


const getOrg = async (request: GetCommunityBusinessRequest, h: Hapi.ResponseToolkit) => {
  const { pre } = request;

  if (pre.hasOwnProperty('organisation') || pre.hasOwnProperty('communityBusiness')) {
    return <Organisation> pre.organisation || <CommunityBusiness> pre.communityBusiness;
  }

  // Fallback case: manually fetch organisation if not already cached.
  return getOrganisation(request, h);
};

export default async (request: GetCommunityBusinessRequest, h: Hapi.ResponseToolkit) => {
  const { auth: { credentials }, server: { app: { knex } } } = request;
  const { user } = credentials;

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120
  const org = await getOrg(request, h);

  const isVolunteer = await Roles.userHas(knex, {
    role: RoleEnum.VOLUNTEER,
    userId: user.id,
    organisationId: org.id,
  });

  if (isVolunteer) {
    return isVolunteer;
  }

  const isVisitor = await Roles.userHas(knex, {
    role: RoleEnum.VISITOR,
    userId: user.id,
    organisationId: org.id,
  });

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120

  return isVisitor;
};
