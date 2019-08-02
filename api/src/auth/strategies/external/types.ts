import { Organisation } from '../../../models';

export type ExternalAppCredentials = {
  scope: string[],
  organisation: Organisation,
};
