/*
 * Route pre-requisite for fetching organisation model based on path parameter
 *
 * Supports:
 * - Fetching, using 'me' as the ID, the org that the user is authenticated with
 * - Fetching the org using a database ID
 * - Fetching the org using a 360 Giving ID
 */
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import { Organisations } from '../../../models';


export interface OrganisationRequest extends Hapi.Request {
  params: {
    organisationId: string
  };
}


const is360GivingId = (s: string) => isNaN(parseInt(s, 10));
const getOrgFromCredentials = (request: OrganisationRequest) =>
  request.auth.credentials.organisation;

export default async (request: OrganisationRequest, h: Hapi.ResponseToolkit) => {
  const { params: { organisationId: id }, server: { app: { knex } } } = request;

  const organisation =
    (id === 'me')
      ? getOrgFromCredentials(request)
      : (is360GivingId(id))
        ? await Organisations.getOne(knex, { where: { _360GivingId: id } })
        : await Organisations.getOne(knex, { where: { id: Number(id) } });

  if (! organisation) {
    throw Boom.notFound('No associated organisation');
  }

  return organisation;
};
