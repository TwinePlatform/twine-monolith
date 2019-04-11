import axios from 'axios';
import { Dictionary, CurriedFunction2, assoc, curry, pick } from 'ramda';


type RenameKeys<T extends Dictionary<any>, L extends Dictionary<string>> =
  CurriedFunction2<L, T, { [k in L[keyof L]]: any }> ;


export const renameKeys: RenameKeys<Dictionary<any>, Dictionary<string>> =
  curry((map, o) =>
    Object.keys(o)
      .reduce((acc, k) => assoc(map[k] || k, o[k], acc), {})
);

export const isDataUrl = (s: string) =>
  s.startsWith('data:');


export const toDataUrl = async (url: string) => {
  const isJpeg = ['.jpg', '.jpeg'].some((s) => url.endsWith(s));
  const pngUrl = isJpeg ? url.replace(/\.(jpg|jpeg)$/, '.png') : url;
  const result = await axios.get(pngUrl, { responseType: 'arraybuffer' });
  const content = Buffer.from(result.data, 'binary').toString('base64');
  return `data:image/png;base64,${content}`;
};


export const pickOrAll = curry(
  (xs: string[] | undefined, o: object) => xs ? pick(xs, o) : { ...o });
