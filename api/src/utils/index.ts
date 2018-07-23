import { Dictionary, CurriedFunction2, assoc, curry } from 'ramda';

type MapKeys =
  CurriedFunction2<(a: string) => string, Dictionary<any>, Dictionary<any>>;

type RenameKeys<T extends Dictionary<any>, L extends Dictionary<string>> =
  CurriedFunction2<L, T, { [k in L[keyof L]]: any }> ;


export const lazyPromiseSeries = (ps: PromiseLike<any>[]): Promise<any[]> =>
  Promise.resolve()
    .then(() =>
      ps.reduce(
        (fp, p) => fp.then((res) => p.then((rp) => res.concat(rp))),
        Promise.resolve([])
      )
    );

export const mapKeys: MapKeys =
  curry((f, o) => Object.keys(o).reduce((acc, k) => assoc(f(k), o[k], acc), {}));

export const renameKeys: RenameKeys<Dictionary<any>, Dictionary<string>> =
  curry((map, o) =>
    Object.keys(o)
      .reduce((acc, k) => assoc(map[k] || k, o[k], acc), {})
);
