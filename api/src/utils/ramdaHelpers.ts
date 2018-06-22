import * as R from 'ramda';

type GenericObj = { [k: string]: any };

const renameKeys = R.curry((keysMap: GenericObj, obj: GenericObj) =>
  R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj)),
);

export { renameKeys };
