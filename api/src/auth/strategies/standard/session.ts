import * as JWT from 'jsonwebtoken';
import { getConfig } from '../../../../config';
import { TTokenManager, TSessionManager, Session } from './types';


const {
  auth: {
    standard: {
      cookie: { name: cookieName },
      jwt: { secret: jwtSecret, signOptions, verifyOptions },
    },
  },
} = getConfig(process.env.NODE_ENV);

export const TokenManager: TTokenManager = {
  create (s) {
    return JWT.sign(s, jwtSecret, signOptions);
  },

  verify (s) {
    return <Session> JWT.verify(s, jwtSecret, verifyOptions);
  },

  decode (s) {
    return <Session> JWT.decode(s);
  },
};

export const SessionManager: TSessionManager = {
  create (request, res, payload, level = 'full') {
    const session = { ...payload, privilege: level };

    const token = TokenManager.create(session);

    return res.state(cookieName, token);
  },

  refresh (request, res) {
    const { session } = request.auth.credentials;

    const token = TokenManager.create(session);

    return res.state(cookieName, token);
  },

  destroy (request, res) {
    return res.unstate(cookieName);
  },

  escalate (request, res) {
    const { session: { userId, organisationId } } = request.auth.credentials;

    const token = TokenManager.create({ userId, organisationId, privilege: 'full' });

    return res.state(cookieName, token);
  },

  deescalate (request, res) {
    const { session: { userId, organisationId } } = request.auth.credentials;

    const token = TokenManager.create({ userId, organisationId, privilege: 'restricted' });

    return res.state(cookieName, token);
  },
};
