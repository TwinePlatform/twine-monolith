import { Organisation } from '../../../models';

declare module '@hapi/hapi' {
  interface AppCredentials extends ExternalAppCredentials {}
}

export type ExternalAppCredentials = {
  scope: string[],
  organisation: Organisation,
};
