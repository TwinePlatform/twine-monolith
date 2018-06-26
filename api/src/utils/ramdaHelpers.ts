import * as R from 'ramda';
import { Dictionary } from './types';

const renameKeys = R.curry((keysMap: Dictionary<any>, obj: Dictionary<any>) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
);

export { renameKeys };
