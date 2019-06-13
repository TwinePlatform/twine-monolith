import { PositionType } from 'chart.js';


export interface Rectangle {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  absWidth: number;
  height: number;
  absHeight: number;
}

export type Corner = {
  x: number
  y: number
};

export type Corners = Corner[];


export const Rectangles = {
  init: (left: number, right: number, top: number, bottom: number): Rectangle => ({
    left,
    right,
    top,
    bottom,
    get width () {
      return right - left;
    },
    get absWidth () {
      return Math.abs(right - left);
    },
    get height () {
      return bottom - top;
    },
    get absHeight () {
      return Math.abs(top - bottom);
    },
  }),

  // Border width should be less than bar width and bar height
  adjustBorderWidth: (borderWidth: number, r: Rectangle) =>
    Math.min(r.absWidth, r.absHeight, Math.max(0, borderWidth)),

  adjustByBorder: (borderSkipped: PositionType, borderWidth: number, r: Rectangle) => {
    // Canvas doesn't allow us to stroke inside the width so we can
    // adjust the sizes to fit if we're setting a stroke on the line
    if (borderWidth) {
      const signX = 1;
      const signY = r.bottom > r.top ? 1 : -1;
      const halfStroke = borderWidth / 2;

      // Adjust borderWidth when bar top position is near vm.base(zero).
      const borderLeft = r.left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
      const borderRight = r.right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
      const borderTop = r.top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
      const borderBottom = r.bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);

      // not become a vertical line?
      const isVerticalLine = borderLeft === borderRight;
      const isHorizontalLine = borderTop === borderBottom;

      return Rectangles.init(
        !isHorizontalLine ? borderLeft : r.left,
        !isHorizontalLine ? borderRight : r.right,
        !isVerticalLine ? borderTop : r.top,
        !isVerticalLine ? borderBottom : r.bottom
      );
    } else {
      return { ...r };
    }
  },
};

export const Corners = {
  init: (x: number, y: number) => ({ x, y }),

  fromRectangle: (r: Rectangle): Corners => {
    // Corner points, from bottom-left to bottom-right clockwise
    // | 1 2 |
    // | 0 3 |
    return [
      Corners.init(r.left, r.bottom),
      Corners.init(r.left, r.top),
      Corners.init(r.right, r.top),
      Corners.init(r.right, r.bottom),
    ];
  },

  selectByPosition: (p: PositionType, cs: Corners) => {
    switch (p) {
      case 'left':
        return cs[1];
      case 'top':
        return cs[2];
      case 'right':
        return cs[3];
      case 'bottom':
      default:
        return cs[0];
    }
  },
};
