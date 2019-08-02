import * as Url from 'url';
import { headOrId } from 'twine-util/arrays';


export const envOr = (f: string, d: string) => process.env[f] || d;

export const envListOr = (f: string, d: string[], sep: string = ',') => {
  const xs = (process.env[f] || '').split(sep);
  return xs.length > 0 && xs[0].length > 0 ? xs : d;
};

export const envNumberOr = (f: string, d: number) => {
  const n = Number(process.env[f]);
  return isNaN(n) ? d : n;
};

export const parseRedisUrl = (url: string) => {
  const redisURL = Url.parse(url, true);

  return {
    host: redisURL.hostname,
    port: Number(redisURL.port),
    database: headOrId(redisURL.query.db) || 0,
  };
};
