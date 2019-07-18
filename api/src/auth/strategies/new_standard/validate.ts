import * as Boom from '@hapi/boom';
import { Users, Organisations } from '../../../models';
import { ValidateFunction } from '../../schema/session_cookie';
import { Session } from './types';
import { Credentials } from './credentials';


const validate: ValidateFunction = async (sid, req) => {
  const { knex } = req;
  const session: Session = req.yar.get(sid);

  if (!session) {
    throw Boom.unauthorized('No valid session');
  }

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
