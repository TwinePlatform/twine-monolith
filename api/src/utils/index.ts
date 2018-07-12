export const lazyPromiseSeries = (ps: PromiseLike<any>[]): Promise<any[]> =>
  Promise.resolve()
    .then(() =>
      ps.reduce(
        (fp, p) => fp.then((res) => p.then((rp) => res.concat(rp))),
        Promise.resolve([])
      )
    );
