import * as JWT from 'jsonwebtoken';
import { getConfig } from '../../../../config';
import serializers from '../serializers';


describe('Logger Service :: Serializers', () => {
  const config = getConfig(process.env.NODE_ENV);

  describe('Request serializer', () => {
    test('unauthenticated request', () => {
      const result = serializers.req(<any> {
        id: '1',
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          host: 'https://bar.com',
          accept: '',
          'accept-encoding': '',
          'accept-language': '',
          connection: '',
          dnt: '',
          'upgrade-insecure-requests': '',
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
        },
      });

      expect(result).toEqual({
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
        },
      });
    });

    test('request with valid cookie', () => {
      const token = JWT.sign(
        { userId: 1, organisationId: 2 },
        config.auth.standard.jwt.secret,
        config.auth.standard.jwt.signOptions
      );

      const result = serializers.req(<any> {
        id: '1',
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          host: 'https://bar.com',
          accept: '',
          'accept-encoding': '',
          'accept-language': '',
          connection: '',
          dnt: '',
          'upgrade-insecure-requests': '',
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          cookie: `${config.auth.standard.cookie.name}=${token}`,
        },
      });

      expect(result).toEqual({
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          cookie: `${config.auth.standard.cookie.name}=${token}`,
        },
        sessionUserId: 1,
        sessionOrgId: 2,
      });
    });

    test('request with invalid cookie', () => {
      const token = 'gibberish';

      const result = serializers.req(<any> {
        id: '1',
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          host: 'https://bar.com',
          accept: '',
          'accept-encoding': '',
          'accept-language': '',
          connection: '',
          dnt: '',
          'upgrade-insecure-requests': '',
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          cookie: `${config.auth.standard.cookie.name}=${token}`,
        },
      });

      expect(result).toEqual({
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          cookie: `${config.auth.standard.cookie.name}=${token}`,
        },
      });
    });

    test('request with valid authorization token', () => {
      const token = JWT.sign(
        { userId: 2, organisationId: 5 },
        config.auth.standard.jwt.secret,
        config.auth.standard.jwt.signOptions
      );

      const result = serializers.req(<any> {
        id: '1',
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          host: 'https://bar.com',
          accept: '',
          'accept-encoding': '',
          'accept-language': '',
          connection: '',
          dnt: '',
          'upgrade-insecure-requests': '',
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          authorization: `${token}`,
        },
      });

      expect(result).toEqual({
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          authorization: `${token}`,
        },
        sessionUserId: 2,
        sessionOrgId: 5,
      });
    });

    test('request with invalid authorization token', () => {
      const token = 'nonsense';

      const result = serializers.req(<any> {
        id: '1',
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          host: 'https://bar.com',
          accept: '',
          'accept-encoding': '',
          'accept-language': '',
          connection: '',
          dnt: '',
          'upgrade-insecure-requests': '',
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          authorization: `${token}`,
        },
      });

      expect(result).toEqual({
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          authorization: `${token}`,
        },
      });
    });

    test('request with authorization bearer token', () => {
      // Bearer tokens are used for external app access (Frontline)
      // They are not JWTs and do not have a payload to decode
      const token = 'anything';

      const result = serializers.req(<any> {
        id: '1',
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          host: 'https://bar.com',
          accept: '',
          'accept-encoding': '',
          'accept-language': '',
          connection: '',
          dnt: '',
          'upgrade-insecure-requests': '',
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          authorization: `Bearer ${token}`,
        },
      });

      expect(result).toEqual({
        method: 'GET',
        url: '/foo/bar',
        query: { fields: ['name'] },
        headers: {
          origin: 'https://foo.com',
          referrer: 'https://bar.com',
          authorization: `Bearer ${token}`,
        },
      });
    });
  });

  describe('Request payload serializer', () => {
    test('payload containing no password fields', () => {
      const result = serializers.payload({
        foo: 'bar',
        lol: 'cat',
        woo: 'sah',
      });

      expect(result).toEqual({
        foo: 'bar',
        lol: 'cat',
        woo: 'sah',
      });
    });

    test('payload containing password fields gets filtered', () => {
      const result = serializers.payload({
        foo: 'bar',
        password: 'cat',
        passwordConfirm: 'sah',
        confirmPassword: 'lol',
      });

      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('Response serializer', () => {
    test('normal response gets headers stripped', () => {
      const result = serializers.res({
        id: 1,
        headers: {
          'content-type': '',
          vary: '',
          'access-control-allow-origin': '',
          'access-control-allow-credentials': '',
          'access-control-expose-headers': '',
          'strict-transport-security': '',
          'x-frame-options': '',
          'x-xss-protection': '',
          'x-download-options': '',
          'x-content-type-options': '',
          'cache-control': '',
          'set-cookie': '',
          'accept-ranges': '',
        },
      });

      expect(result).toEqual({ id: 1 });
    });
  });
});
