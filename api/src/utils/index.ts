type LazyPromiseSeries =
  (a: Promise <any>[]) => Promise <any[] >;

const lazyPromiseSeries :LazyPromiseSeries =
  (ps) => ps.reduce((fp, p) =>
    fp.then((res) => p.then((rp) => res.concat(rp))), Promise.resolve([]));


export { lazyPromiseSeries };
