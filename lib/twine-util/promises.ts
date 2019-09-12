/*
 * Utilities for promises
 */
import { Readable } from 'stream';


export const series = <T>(ps: PromiseLike<T>[]): Promise<T[]> =>
  ps.reduce(
    (fp, p) => fp.then((res) => p.then((rp) => res.concat(Array.isArray(rp) ? [rp] : rp))),
    Promise.resolve([])
  );

export const fromStream = (stream: Readable): Promise<Buffer[]> =>
  new Promise((resolve, reject) => {
    const data: Buffer[] = [];

    stream.on('data', (chunk: any) => data.push(chunk));
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });

export const find = async <T>(fn: (a: T) => Promise<boolean>, xs: T[]): Promise<T> => {
  if (xs.length < 1) {
    throw new Error('Item not found');
  }
  const [head, ...tail] = xs;
  const isFound = await fn(head);
  return isFound
    ? head
    : find(fn, tail);
};

export const some = async <T>(ps: Promise<T>[]) => {
  return Promise.all(ps.map((p) => p.catch((error: Error) => error)));
};

export const silent = <T>(p: Promise<T>): void => {
  p.catch(() => {});
};
