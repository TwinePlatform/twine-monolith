/*
 * Wrapper for generating config object for dummy requests
 * via the Shot interface (server.inject)
 *
 * Created because there have been two API changes to this interface in
 * consecutive releases of Hapi so this is to decouple tests from the interface
 */
import { AuthCredentials, ServerInjectOptions } from '@hapi/hapi';

interface Options extends ServerInjectOptions {
  credentials?: AuthCredentials;
  strategy?: string;
}

export const injectCfg = (opts: Options): ServerInjectOptions => {
  const { credentials, strategy, ..._opts } = opts;
  const auth = credentials
    ? { strategy: strategy || 'standard', credentials }
    : undefined;

  return { ..._opts, auth };
};
