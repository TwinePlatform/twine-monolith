import Chart from 'chart.js';

export default () => {
  (Chart as any).Tooltip.positioners.center = function (elements: any) {
    const { x, y, base } = elements[0]._model;
    const height = base - y;
    return { x, y: y + (height / 2) };
  };
};
