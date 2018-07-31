import { mergeDeepRight } from 'ramda';
import { HttpMethod } from '../types';

export const collapseUrls = (json: any, rootUrl = ''): { [key: string]: any } =>
  Object.keys(json)
    .map((k) => (
      Object.values(HttpMethod).includes(k)
        ? { [`${k} ${rootUrl}`]: json[k] } // terminator case
        : collapseUrls(json[k], `${rootUrl}${k}`) // recursive case
    ))
    .reduce((acc, x) => mergeDeepRight(acc, x), {});


export const splitMethodAndUrl = (endpoint: string): [HttpMethod, string] => {
  const [method, url] = endpoint.split(' ');
  return [method as HttpMethod, url];
};
