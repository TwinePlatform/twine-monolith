import * as Hapi from '@hapi/hapi';
import * as Knex from 'knex';
import { User, Organisation } from '../../../models';
import { RoleEnum } from '../../../models/types';
import { Dictionary } from '../../../types/internal';


declare module '@hapi/hapi' {
  interface UserCredentials extends UserCredential {}
}


export type Session = {
  userId: number
  organisationId: number
  createdAt: Date
  endedAt?: Date
  headers: Dictionary<string>[]
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
  create (k: Knex, u: User, o: Organisation, s?: Session): Promise<Credential>;
  fromRequest (req: Hapi.Request): UserCredential & { scope: string[] };
}
