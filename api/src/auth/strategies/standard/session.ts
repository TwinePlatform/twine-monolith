import * as Hapi from '@hapi/hapi';
import { Session } from './types';


export const Sessions = {
  get: (req: Hapi.Request): Session & { id: string, isAuthenticated: boolean } =>
    ({
      id: req.yar.id,
      isAuthenticated: req.yar.get('isAuthenticated'),
      userId: req.yar.get('userId'),
      organisationId: req.yar.get('organisationId'),
    }),

  set: (req: Hapi.Request, key: string, value: any) =>
    req.yar.set(key, value),

  authenticate: (req: Hapi.Request, userId: number, organisationId: number) =>
    req.yar.set({
      isAuthenticated: true,
      userId,
      organisationId,
    }),

  destroy: (req: Hapi.Request) =>
    req.yar.reset(),
};
