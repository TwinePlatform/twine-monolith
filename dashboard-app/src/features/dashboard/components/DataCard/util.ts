import { intersperse } from 'ramda';

export const sentenceCreator = (xs: string[]) => {
  switch (xs.length) {
    case 0:
    case 1:
      return xs;
    case 2:
      return intersperse(' and ', xs);
    case 3:
    default:
      return intersperse(', ', xs.slice(0, -1))
        .concat(' and ')
        .concat(xs.slice(-1));
  }
};
