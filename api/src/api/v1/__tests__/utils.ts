import { mergeDeepRight } from 'ramda';
import { HttpMethodEnum } from '../types';

export const collapseUrls = (json: any, rootUrl = ''): { [key: string]: any } =>
  Object.keys(json)
    .map((k) => (
      Object.values(HttpMethodEnum).includes(k)
        ? { [`${k} ${rootUrl}`]: json[k] } // terminator case
        : collapseUrls(json[k], `${rootUrl}${k}`) // recursive case
    ))
    .reduce((acc, x) => mergeDeepRight(acc, x), {});


export const splitMethodAndUrl = (endpoint: string): [HttpMethodEnum, string] => {
  const [method, url] = endpoint.split(' ');
  return [method as HttpMethodEnum, url];
};
