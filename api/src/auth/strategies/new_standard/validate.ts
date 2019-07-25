import * as Boom from '@hapi/boom';
import { Users, Organisations } from '../../../models';
import { ValidateFunction } from '../../schema/session_cookie';
import { Credentials } from './credentials';
import { Sessions } from './session';


const validate: ValidateFunction = async (req) => {
  const { server: { app: { knex } } } = req;
  const session = Sessions.get(req);

  const { userId, organisationId } = session;

  const [
    user,
    organisation,
  ] = await Promise.all([
    Users.getOne(knex, { where: { id: userId, deletedAt: null } }),
    Organisations.getOne(knex, { where: { id: organisationId, deletedAt: null } }),
  ]);

  if (!user || !organisation) {
    throw Boom.unauthorized('Unrecognised user or organisation');
  }

  const credentials = await Credentials.get(knex, user, organisation, session);

  return { credentials } as any;
};

export default validate;
