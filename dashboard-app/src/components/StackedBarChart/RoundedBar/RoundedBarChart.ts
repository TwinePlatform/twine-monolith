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

const draw = ({ ctx, rectangle, corner, radius, ...params }: DrawingParams) => {
  const { left, top, width, height } = rectangle;

  ctx.beginPath();
  ctx.fillStyle = params.fillStyle;
  ctx.strokeStyle = params.strokeStyle;
  ctx.lineWidth = params.borderWidth;

  // Draw rectangle from first corner
  ctx.moveTo(corner.x, corner.y);

  if (radius && radius > 0) {
    ctx.moveTo(left + radius, top);

    ctx.lineTo(left + width - radius, top);

    // top right
    ctx.quadraticCurveTo(left + width, top, left + width, top + radius);
    ctx.lineTo(left + width, top + height - radius);

    // bottom right
    ctx.lineTo(left + width, top + height);
    ctx.lineTo(left + radius, top + height);

    // bottom left
    ctx.lineTo(left, top + height);
    ctx.lineTo(left, top + radius);

    // top left
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
const calculateRadius = (height: number, width: number, radius: number = 0) =>
  clamp(0, Math.min(height, width) / 2, radius);


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

      const remainingDatasets = this._chart.data.datasets.slice(this._datasetIndex + 1);
      const shouldNotRound = remainingDatasets
        .some((dataset: any) => dataset.data[this._index] > 0 && !dataset._meta[0].hidden);

      draw({
        ctx,
        rectangle: rect,
        corner: corners[0],
        radius: shouldNotRound ? 0 : radius,
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
