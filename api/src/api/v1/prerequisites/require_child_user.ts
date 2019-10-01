/*
 * "user_details-child" route pre-requisite
 *
 * Determines if the authenticated user is trying to access an user
 * which is actually a "child" entity.
 *
 * Conditions under which this is true for user X attemptying to access:
 * user Y
 * - User X is a CB_ADMIN for a community business for which user Y is a VISITOR
 * - User X is a CB_ADMIN for a community business for which user Y is a VOLUNTEER
 * - User X is a Twine admin
 */
import * as Hapi from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import isChildUser from './is_child_user';


export default async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const isChild = await isChildUser(request, h)

  if (!isChild) {
    throw Boom.forbidden();
  }

  return true;
};
