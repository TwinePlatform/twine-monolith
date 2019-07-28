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

    test('request with cookie', () => {
      const token = 'fpiwg239-tjfi42tjr-0few9ingr429t0jewf';

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
        sessionUserId: token,
      });
    });

    test('request with valid authorization token', () => {
      const token = 'kmfe429yj032fk0-12jr32092jr20fen2093refo-w0d';

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
        sessionUserId: token,
      });
    });

    test('request with authorization bearer token', () => {
      // Bearer tokens are used for external app access (Frontline)
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
        sessionUserId: token,
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
