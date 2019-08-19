import * as Hapi from '@hapi/hapi';
import { Session } from './types';
import { UserSessionRecords } from '../../../models/user_session_record';
import { Credentials } from '.';
import { quiet } from 'twine-util/promises';


export const Sessions = {
  get: (req: Hapi.Request): Session & { id: string, isAuthenticated: boolean } =>
    ({
      id: req.yar.id,
      isAuthenticated: req.yar.get('isAuthenticated'),
      userId: req.yar.get('userId'),
      organisationId: req.yar.get('organisationId'),
      createdAt: req.yar.get('startedAt'),
      referrers: req.yar.get('referrers'),
      sessionEndType: req.yar.get('sessionEndType'),
    }),

  set: (req: Hapi.Request, key: string, value: any) =>
    req.yar.set(key, value),

  authenticate: (req: Hapi.Request, userId: number, organisationId: number) => {
    const { user, organisation } = Credentials.fromRequest(req);
    quiet(UserSessionRecords.initSession(req.server.app.knex, user, organisation, req.yar.id));

    return req.yar.set({
      isAuthenticated: true,
      userId,
      organisationId,
      createdAt: new Date(),
      referrers: [],
    });
  },

  destroy: (req: Hapi.Request) => {
    const { user, organisation } = Credentials.fromRequest(req);
    quiet(UserSessionRecords.initSession(req.server.app.knex, user, organisation, req.yar.id));
    return req.yar.reset();
  },

  update: (req: Hapi.Request) => {
    quiet(
      UserSessionRecords.updateSession(req.server.app.knex, req.yar.id, [req.headers.referrer])
    );
  },
};
