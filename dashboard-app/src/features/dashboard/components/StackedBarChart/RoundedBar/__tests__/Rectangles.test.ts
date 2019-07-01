import { Rectangles, Corners } from '../Rectangles';

describe('Rectangles', () => {
  describe('adjustBorderWidth', () => {
    [
      {
        name: 'bw < 0 < width < height',
        bw: -1,
        w: 10,
        h: 20,
        expected: 0,
      },
      {
        name: '0 < bw < width < height',
        bw: 1,
        w: 10,
        h: 20,
        expected: 1,
      },
      {
        name: '0 < width < bw < height',
        bw: 10,
        w: 1,
        h: 20,
        expected: 1,
      },
      {
        name: '0 < width < height < bw',
        bw: 20,
        w: 1,
        h: 10,
        expected: 1,
      },
      {
        name: 'bw < 0 < height < width',
        bw: -1,
        w: 20,
        h: 10,
        expected: 0,
      },
      {
        name: '0 < bw < height < width',
        bw: 1,
        w: 20,
        h: 10,
        expected: 1,
      },
      {
        name: '0 < height < bw < width',
        bw: 10,
        w: 20,
        h: 1,
        expected: 1,
      },
      {
        name: '0 < height < width < bw',
        bw: 20,
        w: 10,
        h: 1,
        expected: 1,
      },
    ]
      .forEach(({ bw, w, h, name, expected }) => {
        test(name, () => {
          expect(Rectangles.adjustBorderWidth(bw, Rectangles.init(0, w, 0, -h))).toBe(expected);
        });
      });
  });
});

describe('Corners', () => {
  describe('fromRectangle', () => {
    test('initialises correctly from Rectangle', () => {
      expect(Corners.fromRectangle(Rectangles.init(0, 10, 0, -10)))
        .toEqual([
          { x: 0, y: -10 },
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: -10 },
        ]);
    });
  });

  describe('selectByPosition', () => {
    const r = Rectangles.init(0, 10, 0, -10);

    test('left', () => {
      const cs = Corners.fromRectangle(r);
      expect(Corners.selectByPosition('left', cs)).toEqual({ x: 0, y: 0 });
    });
    test('right', () => {
      const cs = Corners.fromRectangle(r);
      expect(Corners.selectByPosition('right', cs)).toEqual({ x: 10, y: -10 });
    });
    test('top', () => {
      const cs = Corners.fromRectangle(r);
      expect(Corners.selectByPosition('top', cs)).toEqual({ x: 10, y: 0 });
    });
    test('bottom', () => {
      const cs = Corners.fromRectangle(r);
      expect(Corners.selectByPosition('bottom', cs)).toEqual({ x: 0, y: -10 });
    });
    test('other', () => {});
  });
});
