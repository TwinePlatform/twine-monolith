import { Organisation } from '../../../models';

export type ExternalAppCredentials = {
  scope: string[],
  app: { organisation: Organisation },
};
