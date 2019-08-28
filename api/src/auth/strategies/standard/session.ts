import * as Hapi from '@hapi/hapi';
import { Session } from './types';
import { UserSessionRecords } from '../../../models/user_session_record';
import { silent } from 'twine-util/promises';
import { User, Organisation } from '../../../models';


export const Sessions = {
  get: (req: Hapi.Request): Session & { id: string, isAuthenticated: boolean } =>
    ({
      id: req.yar.id,
      isAuthenticated: req.yar.get('isAuthenticated'),
      userId: req.yar.get('userId'),
      organisationId: req.yar.get('organisationId'),
      createdAt: req.yar.get('createdAt'),
      headers: req.yar.get('headers'),
      sessionEndType: req.yar.get('sessionEndType'),
    }),

  authenticate: (req: Hapi.Request, user: User, organisation: Organisation) => {
    silent(UserSessionRecords.initSession(
      req.server.app.knex,
      user,
      organisation,
      req.yar.id,
      req.headers
    ));

    return req.yar.set({
      isAuthenticated: true,
      userId: user.id,
      organisationId: organisation.id,
      createdAt: new Date(),
      headers: [],
    });
  },

  destroy: (req: Hapi.Request) => {
    silent(UserSessionRecords.endSession(req.server.app.knex, req.yar.id, 'log_out'));
    return req.yar.reset();
  },

  update: (req: Hapi.Request) => {
    silent(
      UserSessionRecords.updateSession(req.server.app.knex, req.yar.id, req.headers)
    );
  },
};
