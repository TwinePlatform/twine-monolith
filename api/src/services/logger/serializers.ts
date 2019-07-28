import * as Hapi from '@hapi/hapi';
import * as Cookie from 'cookie';
import { compose, evolve, omit } from 'ramda';
import { getConfig } from '../../../config';


const { auth: { standard } } = getConfig(process.env.NODE_ENV);

const extractCookie = (c: string) => Cookie.parse(c)[standard.cookie.name];

const extractBearerToken = (c: string = '') => c.split('Bearer ')[1] || c || '';

const extractToken = (headers: Hapi.Util.Dictionary<string>) =>
  headers.cookie
    ? extractCookie(headers.cookie)
    : headers.authorization && headers.authorization.includes('Bearer')
      ? extractBearerToken(headers.authorization)
      : headers.authorization;

const attachUserId = (req: Hapi.Request) => {
  const sid = extractToken(req.headers);
  return { ...req, sessionUserId: sid };
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
    }) as any,
    attachUserId
  ),

  payload: omit(['password', 'passwordConfirm', 'confirmPassword']),

  res: omit(['v', 'responseTime', 'headers']),
};
