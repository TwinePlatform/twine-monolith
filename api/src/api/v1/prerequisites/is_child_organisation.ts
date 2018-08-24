/*
 * "organisation_details-child" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an organisation
 * which is actually a "child" entity.
 *
 * Conditions under which this is true for organisation X:
 * - User is an admin for X
 * - User is an admin for a funding body which owns at least
 *   one funding programme of which X is a member
 * - User is a Twine admin
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
import { OrganisationRequest } from '../types';
import getOrganisation from './get_organisation';
import { RoleEnum } from '../../../auth/types';
import Roles from '../../../auth/roles';


const getOrg = async (request: OrganisationRequest, h: Hapi.ResponseToolkit) => {
  const { pre } = request;

  if (pre.hasOwnProperty('organisation') || pre.hasOwnProperty('communityBusiness')) {
    return <Organisation> pre.organisation || <CommunityBusiness> pre.communityBusiness;
  }

  // Fallback case: manually fetch organisation if not already cached.
  return getOrganisation(request, h);
};

export default async (request: OrganisationRequest, h: Hapi.ResponseToolkit) => {
  const { auth: { credentials }, server: { app: { knex } } } = request;
  const { role, user } = credentials;

  if (role === RoleEnum.TWINE_ADMIN) {
    return true;
  }

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120
  const org = await getOrg(request, h);

  const isCbAdmin = await Roles.userHas(knex, {
    role: RoleEnum.ORG_ADMIN,
    userId: user.id,
    organisationId: org.id,
  });

  // TODO: Funding body case is unimplemented
  //       See: https:github.com/TwinePlatform/twine-api/issues/120

  return isCbAdmin;
};
