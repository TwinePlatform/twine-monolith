import * as Hapi from 'hapi';
import * as Cookie from 'cookie';
import * as JWT from 'jsonwebtoken';
import { compose, evolve, omit } from 'ramda';
import { getConfig } from '../../../config';
import { Session } from '../../auth/strategies/standard/types';


const { auth: { standard } } = getConfig(process.env.NODE_ENV);

const extractCookie = (c: string) => Cookie.parse(c)[standard.cookie.name];

const extractBearerToken = (c: string = '') => c.split('Bearer ')[1] || c || '';

const extractToken = (headers: Hapi.Util.Dictionary<string>) =>
  headers.cookie
    ? extractCookie(headers.cookie)
    : extractBearerToken(headers.authorization);

const decodeToken = (c: string): Partial<Session> => {
  let decoded: Partial<Session>;
  try {
    decoded = <any> JWT.verify(c, standard.jwt.secret, standard.jwt.verifyOptions);

  } catch (error) {
    decoded = {};
  }

  return decoded;
};

const getIds = compose(decodeToken, extractToken);

const attachUserId = (req: { headers: Hapi.Util.Dictionary<string> }) => {
  const { userId, organisationId } = getIds(req.headers);
  return { ...req, sessionUserId: userId, sessionOrgId: organisationId };
};


export default {
  req: compose(
    omit(['id', 'remotePort', 'remoteAddress']),
    evolve({
      headers: omit([
        'host',
        'accept',
        'accept-encoding',
        'accept-language',
        'connection',
        'dnt',
        'upgrade-insecure-requests',
        'x-request-id',
        'x-forwarded-for',
        'x-forwarded-proto',
        'x-forwarded-port',
        'x-request-start',
        'total-route-time',
        'via',
        'connect-time',
      ]),
    }),
    attachUserId
  ),

  payload: omit(['password', 'passwordConfirm', 'confirmPassword']),

  res: omit(['v', 'responseTime', 'headers']),
};
