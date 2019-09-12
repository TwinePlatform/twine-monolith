import * as Hapi from '@hapi/hapi';

/*
 * Prereq types
 */
export interface RequireSiblingPreReq extends Hapi.Request {
  params: {
    userId: string
  };
}
