
export const sentenceCreator = (xs: string[]) => {
  switch (xs.length) {
    case 0:
    case 1:
      return xs;
    case 2:
      return [xs[0], ' and ', xs[1]];
    case 3:
    default:
      const first = xs.slice(0, -1);
      const firstWithComma = first
        .reduce((a: string[], e: string) => a.concat(e, ', '), [])
        .slice(0, -1);
      const [last] = xs.slice(-1);
      return firstWithComma
        .concat([' and ', last]);

  }
};
