import { draw, calculateRadius, checkShouldRound } from '../RoundedBarChart';
import { Rectangles, Corners } from '../Rectangles';

describe('RoundedBarChart', () => {
  describe('draw', () => {
    const MockCtx = jest.fn(() => ({
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
    }));

    test('rounded rectangle, no border width', () => {
      const ctx = new MockCtx();
      const rectangle = Rectangles.init(0, 10, 0, -10);
      const corners = Corners.fromRectangle(rectangle);
      const radius = 2;

      draw({
        ctx: ctx as any,
        rectangle,
        corner: corners[0],
        radius,
        borderWidth: 0,
        fillStyle: '',
        strokeStyle: '',
      });

      expect(ctx.beginPath).toHaveBeenCalledTimes(1);
      expect(ctx.fill).toHaveBeenCalledTimes(1);
      expect(ctx.stroke).not.toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledTimes(2);
      expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, -10);
      expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 2, 0);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 8, 0);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, -10);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(3, 0, -10);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(4, 0, 2);
      expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(1, 10, 0, 10, 2);
      expect(ctx.quadraticCurveTo).toHaveBeenNthCalledWith(2, 0, 0, 2, 0);
    });

    test('normal rectangle, no border width', () => {
      const ctx = new MockCtx();
      const rectangle = Rectangles.init(0, 10, 0, -10);
      const corners = Corners.fromRectangle(rectangle);
      const radius = 0;

      draw({
        ctx: ctx as any,
        rectangle,
        corner: corners[0],
        radius,
        borderWidth: 0,
        fillStyle: '',
        strokeStyle: '',
      });

      expect(ctx.beginPath).toHaveBeenCalledTimes(1);
      expect(ctx.fill).toHaveBeenCalledTimes(1);
      expect(ctx.stroke).not.toHaveBeenCalled();
      expect(ctx.moveTo).toHaveBeenCalledTimes(2);
      expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, -10);
      expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 10, 0);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, -10);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(3, 0, -10);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(4, 0, 0);
    });

    test('normal rectangle, border width', () => {
      const ctx = new MockCtx();
      const rectangle = Rectangles.init(0, 10, 0, -10);
      const corners = Corners.fromRectangle(rectangle);
      const radius = 0;

      draw({
        ctx: ctx as any,
        rectangle,
        corner: corners[0],
        radius,
        borderWidth: 1,
        fillStyle: '',
        strokeStyle: '',
      });

      expect(ctx.beginPath).toHaveBeenCalledTimes(1);
      expect(ctx.fill).toHaveBeenCalledTimes(1);
      expect(ctx.stroke).toHaveBeenCalledTimes(1);
      expect(ctx.moveTo).toHaveBeenCalledTimes(2);
      expect(ctx.moveTo).toHaveBeenNthCalledWith(1, 0, -10);
      expect(ctx.moveTo).toHaveBeenNthCalledWith(2, 0, 0);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(1, 10, 0);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(2, 10, -10);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(3, 0, -10);
      expect(ctx.lineTo).toHaveBeenNthCalledWith(4, 0, 0);
    });
  });

  describe('calculateRadius', () => {
    test('no radius', () => {
      expect(calculateRadius(10, 5)).toBe(0);
    });
    test('2 * radius < 0 < W < H', () => {
      expect(calculateRadius(10, 5, -2)).toBe(0);
    });
    test('0 < 2 * radius < W < H', () => {
      expect(calculateRadius(10, 5, 2)).toBe(2);
    });
    test('0 < W < 2 * radius < H', () => {
      expect(calculateRadius(10, 5, 3)).toBe(2.5);
    });
    test('0 < W < H < 2 * radius', () => {
      expect(calculateRadius(10, 5, 6)).toBe(2.5);
    });
    test('2 * radius < 0 < H < W', () => {
      expect(calculateRadius(5, 10, -2)).toBe(0);
    });
    test('0 < 2 * radius < H < W', () => {
      expect(calculateRadius(5, 10, 2)).toBe(2);
    });
    test('0 < H < 2 * radius < W', () => {
      expect(calculateRadius(5, 10, 3)).toBe(2.5);
    });
    test('0 < H < W < 2 * radius', () => {
      expect(calculateRadius(5, 10, 6)).toBe(2.5);
    });
  });

  describe('checkShouldRound', () => {
    test('final dataset = should round', () => {
      const datasets = [{}];
      expect(checkShouldRound(datasets, 1, 0)).toBe(true);
    });

    test('zero remaining hidden datasets have data = should round', () => {
      const data = [0, 0, 0, 0, 0, 0];
      const datasets = [{}, { data, _meta: [{ hidden: true }] }];
      data.forEach((_, idx) => {
        expect(checkShouldRound(datasets, 0, idx)).toBe(true);
      });
    });

    test('one remaining hidden dataset has data = should round', () => {
      const data = [0, 0, 0, 1, 0, 0];
      const datasets = [{}, { data, _meta: [{ hidden: true }] }];
      data.forEach((_, idx) => {
        expect(checkShouldRound(datasets, 0, idx)).toBe(true);
      });
    });

    test('multiple remaining hidden datasets have data = should round', () => {
      const datasets = [
        {},
        { data: [0, 0, 0, 1], _meta: [{ hidden: true }] },
        { data: [0, 0, 2, 1], _meta: [{ hidden: true }] },
        { data: [0, 1, 0, 1], _meta: [{ hidden: true }] },
      ];
      expect(checkShouldRound(datasets, 0, 0)).toBe(true);
      expect(checkShouldRound(datasets, 0, 1)).toBe(true);
      expect(checkShouldRound(datasets, 0, 2)).toBe(true);
      expect(checkShouldRound(datasets, 0, 3)).toBe(true);
    });

    test('zero remaining un-hidden datasets have data = should round', () => {
      const datasets = [
        {},
        { data: [0, 0, 0, 0, 0, 0] },
      ];
      expect(checkShouldRound(datasets, 0, 2)).toBe(true);
    });

    test('one remaining un-hidden dataset has data = varying', () => {
      const data = [0, 0, 0, 1, 0, 0];
      const datasets = [{}, { data }];
      data.forEach((value, idx) => {
        expect(checkShouldRound(datasets, 0, idx)).toBe(value === 0);
      });
    });

    test('multiple remaining un-hidden datasets have data = varying', () => {
      const datasets = [
        {},
        { data: [0, 0, 0, 1] },
        { data: [0, 0, 2, 1] },
        { data: [0, 1, 0, 1] },
      ];
      expect(checkShouldRound(datasets, 0, 0)).toBe(true);
      expect(checkShouldRound(datasets, 0, 1)).toBe(false);
      expect(checkShouldRound(datasets, 0, 2)).toBe(false);
      expect(checkShouldRound(datasets, 0, 3)).toBe(false);
    });
  });
});
