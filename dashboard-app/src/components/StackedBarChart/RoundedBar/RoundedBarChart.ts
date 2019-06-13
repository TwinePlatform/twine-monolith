/*
 * RoundedBarChart
 *
 * See: https://stackoverflow.com/questions/43254153/how-to-create-rounded-bars-for-bar-chart-js-v2
 */
import Chart, { PositionType } from 'chart.js';
import { clamp } from 'ramda';
import { Rectangles, Corners, Rectangle, Corner } from './Rectangles';


type DrawingParams = {
  ctx: CanvasRenderingContext2D
  rectangle: Rectangle
  corner: Corner
  borderWidth: number
  fillStyle: string
  strokeStyle: string
  radius?: number
};

export const draw = ({ ctx, rectangle, corner, radius, ...params }: DrawingParams) => {
  const { left, top, width, height } = rectangle;

  ctx.beginPath();
  ctx.fillStyle = params.fillStyle;
  ctx.strokeStyle = params.strokeStyle;
  ctx.lineWidth = params.borderWidth;

  // Draw rectangle from first corner
  ctx.moveTo(corner.x, corner.y);

  if (radius && radius > 0) {
    // top line
    ctx.moveTo(left + radius, top);
    ctx.lineTo(left + width - radius, top);

    // top right corner
    ctx.quadraticCurveTo(left + width, top, left + width, top + radius);

    // right line
    ctx.lineTo(left + width, top + height);

    // bottom line
    ctx.lineTo(left, top + height);

    // left line
    ctx.lineTo(left, top + radius);

    // top left corner
    ctx.quadraticCurveTo(left, top, left + radius, top);

  } else {
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left, top + height);
    ctx.lineTo(left, top);
  }

  ctx.fill();
  if (params.borderWidth) {
    ctx.stroke();
  }
};

// If radius is less than 0 or is large enough to cause drawing errors a max radius is imposed.
// 0 < R < Min(|H|/2, |W|/2)
export const calculateRadius = (height: number, width: number, radius: number = 0) =>
  clamp(0, Math.min(height, width) / 2, radius);

/**
 * Determines whether the current dataset (represented by `datasetIdx`) of the current
 * x-axis index (represented by `dataIdx`) should render as a rounded rectangle or not.
 * Only the top-most rectangle in the stack should be rendered.
 *
 * Chart.js iterates through the datasets when rendering, using `datasetIdx`.
 * This function uses `datasetIdx` to grab the datasets that _remain to be rendered_ after
 * the current dataset. If any of those datasets either (1) are hidden, or (2) have non-zero
 * data at the current value of `dataIdx`, then the rectangle for the current `datasetIdx`
 * should _not_ be rounded, since it will not be the top-most one in the stack.
 */
export const checkShouldRound = (datasets: any[], datasetIdx: number, dataIdx: number) =>
  !datasets
    .slice(datasetIdx + 1)
    .some((dataset: any) =>
      dataset.data[dataIdx] > 0 &&
      !(dataset._meta && dataset._meta[0] && dataset._meta[0].hidden)
    );

/*
 * !!MUTATION!!
 *
 * When invoked this:
 * 1. Mutates the `Chart.elements` object, adding a `RoundedTopRectangle` element type
 * 2. Mutates the `Chart` object, adding a new chart type `roundedBar`
 */
export default () => {
  (Chart as any).elements.RoundedTopRectangle = (Chart as any).elements.Rectangle.extend({
    draw () {
      const ctx = this._chart.ctx;
      const vm = this._view;
      const borderSkipped: PositionType = vm.borderSkipped || 'bottom';

      const rectBase = Rectangles.init(
        vm.x - vm.width / 2,
        vm.x + vm.width / 2,
        vm.y,
        vm.base
      );
      const borderWidth = Rectangles.adjustBorderWidth(vm.borderWidth, rectBase);
      const rect = Rectangles.adjustByBorder(borderSkipped, borderWidth, rectBase);
      const corners = Corners.fromRectangle(rect);
      const radius = calculateRadius(
        rect.absHeight,
        rect.absWidth,
        this._chart.config.options.cornerRadius
      );

      const shouldRound = checkShouldRound(
        this._chart.data.datasets,
        this._datasetIndex,
        this._index
      );

      draw({
        ctx,
        rectangle: rect,
        corner: corners[0],
        radius: shouldRound ? radius : 0,
        fillStyle: vm.backgroundColor,
        strokeStyle: vm.borderColor,
        borderWidth,
      });
    },
  });

  Chart.defaults.roundedBar = Chart.helpers.clone(Chart.defaults.bar);
  Chart.controllers.roundedBar = Chart.controllers.bar.extend({
    dataElementType: (Chart as any).elements.RoundedTopRectangle,
  });
};
