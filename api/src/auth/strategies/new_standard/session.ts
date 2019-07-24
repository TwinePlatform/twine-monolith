import * as Hapi from '@hapi/hapi';
import { Session } from './types';

export const Sessions = {
  get: (req: Hapi.Request, sid: string): Session => req.yar.get(sid),
  set: (req: Hapi.Request, key: string, value: any) => req.yar.set(key, value),
};
