import * as stream from 'stream';
import { Promises } from '..';


describe('Utilities :: Promises', () => {
  describe('series', () => {
    test('Array of promises resolves to array of resolved values', async () => {
      const ps = [
        Promise.resolve(1),
        Promise.resolve(2),
        Promise.resolve(3),
      ];

      const xs = await Promises.series(ps);

      expect(xs).toEqual([1, 2, 3]);
    });

    test('Promises are called in order', async () => {
      let count = 0;
      const then = jest.fn((a) => a(count++));

      const ps = [
        { then },
        { then },
        { then },
      ];

      const xs = await Promises.series(ps);

      expect(xs).toEqual([0, 1, 2]);
      expect(then.mock.calls).toHaveLength(3);
      then.mock.calls[0][0]((a: number) => expect(a).toBe(0));
      then.mock.calls[1][0]((a: number) => expect(a).toBe(1));
      then.mock.calls[2][0]((a: number) => expect(a).toBe(2));
    });
  });

  describe('fromStream', () => {
    test('concats stream contents into promise', async () => {
      const rstream = new stream.Readable();
      const wpromise = Promises.fromStream(rstream);

      rstream.push('chunk 1;');
      rstream.push('chunk 2;');
      rstream.push(null); // EOF

      const result = await wpromise;

      expect(result.toString()).toBe('chunk 1;,chunk 2;');
    });

    test('rejects on error', async () => {
      expect.assertions(1);

      const rstream = new stream.Readable();
      const wpromise = Promises.fromStream(rstream);

      rstream.push('chunk 1;');
      rstream.push('chunk 2;');
      rstream.emit('error', new Error('oops'));
      rstream.push(null); // EOF

      try {
        await wpromise;
      } catch (error) {
        expect(error.message).toBe('oops');
      }
    });
  });

  describe('find', () => {
    test('empty array rejects', async () => {
      expect.assertions(1);

      try {
        await Promises.find(() => Promise.resolve(true), []);
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }
    });

    test('unsuccessful find rejects', async () => {
      expect.assertions(1);

      try {
        await Promises.find((a) => Promise.resolve(a === 5), [1, 2, 3, 4]);
      } catch (error) {
        expect(error.message).toBe('Item not found');
      }
    });

    test('successfully finds element', async () => {
      const x = await Promises.find((a) => Promise.resolve(a === 2), [1, 2]);
      expect(x).toBe(2);
    });
  });
});
