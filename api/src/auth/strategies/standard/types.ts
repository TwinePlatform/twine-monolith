import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { User, Organisation } from '../../../models';
import { RoleEnum } from '../../../models/types';


declare module '@hapi/hapi' {
  interface UserCredentials extends UserCredential {}
}


export type Session = {
  userId: number
  organisationId: number
  startedAt: Date
  endedAt?: Date
  referrers: string[]
  sessionEndType?: 'log_out' | 'expired'
};

export type UserCredential = {
  user: User
  organisation: Organisation
  roles: RoleEnum[]
  session?: Session
};

export type Credential = { scope: string[], user: UserCredential };

export interface ICredentials {
  get (k: Knex, u: User, o: Organisation, s?: Session): Promise<Credential>;
  fromRequest (req: Hapi.Request): UserCredential & { scope: string[] };
}
