
export const sentenceCreator = (xs: string[]) => {
  switch (xs.length) {
    case 0:
    case 1:
      return xs;
    case 2:
      return [xs[0], 'and', xs[1]].map((x) => x.replace('and', ' and '));
    case 3:
    default:
      const first = xs.length === 3
        ? xs.slice(0, 1)
        : xs.slice(0, 2);
      const firstWithComma = first.join(' , ').split(' ');
      const [penultimate, last] = xs.slice(-2);
      return firstWithComma
        .concat([',', penultimate, 'and', last])
        .map(((x) => x.replace(',', ', ').replace('and', ' and ')));
  }
};
