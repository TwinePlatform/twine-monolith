/*
 * String utilities
 */

export const capitalise
  = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);


export const onlynl = (ss: TemplateStringsArray, ...placeholders: any[]) => {
  return ss
    .reduce((acc, s, i) => `${acc}${placeholders[i - 1]}${s}`)
    .replace(/[\ \t][\ \t]+/g, '');
};
