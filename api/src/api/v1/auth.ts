/*
 * Authentication Strategies
 */
import * as Hapi from '@hapi/hapi';
import * as standardStrategy from '../../auth/strategies/standard';
import * as externalStrategy from '../../auth/strategies/external';


export const getCredentialsFromRequest = (request: Hapi.Request) => {
  switch (request.auth.strategy) {
  case standardStrategy.name:
    return standardStrategy.Credentials.fromRequest(request);

  case externalStrategy.name:
    return externalStrategy.ExternalCredentials.fromRequest(request);

  default:
    throw new Error(`Unrecognised strategy: ${request.auth.strategy}`);
  }
};
