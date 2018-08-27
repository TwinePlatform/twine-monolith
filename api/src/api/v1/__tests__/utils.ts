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

/*
 * Replace express-router-style path parameters (e.g. :id)
 * with default values. Simply add cases to the switch statement.
 */
export const fillPathParams = (url: string) =>
  url.split('/').map((fragment) => {
    if (/\:\w+/.test(fragment)) {
      return fragment.replace(/\:(\w+)/, (_, p1) => {
        switch (p1) {
          case 'id':
            return '1';

          case 'question_id':
            return 'g';

          default:
            return '1';
        }
      });
    } else {
      return fragment;
    }
  })
  .join('/');

