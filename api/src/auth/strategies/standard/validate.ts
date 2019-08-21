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

  /* istanbul ignore if */
  if (!user || !organisation) {
    // Functionally impossible to get here given the login handler and the auth schema,
    // but kept just in case (and to decouple from the above)
    throw Boom.unauthorized('Unrecognised user or organisation');
  }

  const credentials = await Credentials.get(knex, user, organisation, session);

  return { credentials };
};

export default validate;
