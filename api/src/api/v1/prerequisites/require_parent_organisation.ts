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
import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import isParentOrganisation from './is_parent_organisation';

export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const isParent = await isParentOrganisation(request, h)

  if (!isParent) {
    throw Boom.forbidden();
  }

  return true;
};
