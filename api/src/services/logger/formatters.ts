import * as Hapi from 'hapi';
import * as Cookie from 'cookie';
import * as JWT from 'jsonwebtoken';
import { compose } from 'ramda';
import { RequestErrorEvent, RequestSentEvent, LogLine } from './types';
import { getConfig } from '../../../config';


const { auth: { standard } } = getConfig(process.env.NODE_ENV);


const tagOrder: (keyof LogLine)[] = [
  'event',
  'method',
  'path',
  'statusCode',
  'origin',
  'userId',
  'organisationId',
  'query',
  'payload',
  'response',
];

const errorOrder: (keyof LogLine)[] = ['errorMessage', 'errorStack'];

const extractCookie = (c: string) => {
  const { [standard.cookie.name]: token } = Cookie.parse(c);
  return token;
};

const decodeToken = (c: string): { userId?: number, organisationId?: number } => {
  let decoded: { userId?: number, organisationId?: number };
  try {
    decoded = <any> JWT.verify(c, standard.jwt.secret, standard.jwt.verifyOptions);

  } catch (error) {
    decoded = {};
  }

  return decoded;
};

const getIds = compose(decodeToken, extractCookie);

const extractOrigin = (headers: Hapi.Util.Dictionary<string>) => {
  return ['x-forwarded-for', 'origin', 'referer']
  .reduce((acc, k) => acc ? acc : headers[k], null) || '';
};

const formatOutput = (data: LogLine): string => {
  return tagOrder
    .map((k) => `${k}=${data[k]}`)
    .join(';')
    .concat(';\n')
    .concat(
      data.errorMessage
        ? errorOrder.map((k) => `${k}=${data[k]}`).join(';\n')
        : ''
    );
};

export const formatError = (data: RequestErrorEvent) => {
  const origin = extractOrigin(data.headers);
  const { userId, organisationId } = getIds(data.headers.cookie);

  return formatOutput({
    event: data.event,
    method: data.method,
    origin,
    userId,
    organisationId,
    errorMessage: data.error.message,
    errorStack: data.error.stack,
  });
};

export const formatResponse = (data: RequestSentEvent) => {
  const origin = extractOrigin(data.headers);
  const { userId, organisationId } = getIds(data.headers.cookie);

  return formatOutput({
    event: data.event,
    method: data.method,
    path: data.path,
    statusCode: data.statusCode,
    origin,
    userId,
    organisationId,
    query: JSON.stringify(data.query),
    payload: JSON.stringify(data.requestPayload),
    response: data.statusCode >= 400
      ? (data.responsePayload ? JSON.stringify(data.responsePayload) : '')
      : '',
  });
};
