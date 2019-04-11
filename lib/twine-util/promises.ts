/*
 * Utilities for promises
 */
import * as stream from 'stream';


export const series = <T>(ps: PromiseLike<T>[]): Promise<T[]> =>
  ps.reduce(
    (fp, p) => fp.then((res) => p.then((rp) => res.concat(rp))),
    Promise.resolve([])
  );

export const fromStream = (stream: stream.Readable): Promise<Buffer[]> =>
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
