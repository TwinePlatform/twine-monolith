import { MathUtil } from 'twine-util';
import { ColoursEnum } from '../../../../../lib/ui/design_system';
const round = MathUtil.roundTo(2);


export const totalizer = {
  id: 'totalizer',

  beforeUpdate: (chart: any) => {
    const totals: number[] = [];
    let utmost = 0;

    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      if (chart.isDatasetVisible(datasetIndex)) {
        utmost = datasetIndex;
        dataset.data.forEach((value: any, index: number) => {
          totals[index] = (totals[index] || 0) + value;
        });
      }
    });

    chart.$totalizer = {
      totals: totals.map(round),
      utmost,
    };
  },
};


export const getStackedGraphOptions = (
  xAxisTitle: string,
  yAxisTitle: string,
  tooltipUnit: string) => ({
    legend: {
      display: false,
    },
    tooltips: {
      position: 'center',
      backgroundColor: ColoursEnum.transparentWhite,
      titleFontColor: ColoursEnum.darkGrey,
      titleFontStyle: 'bold',
      bodyFontColor: ColoursEnum.darkGrey,
      borderColor: ColoursEnum.darkGrey,
      borderWidth: 1,
      callbacks: {
        title (tooltipItem: any) {
          return `${tooltipItem[0].value} ${tooltipUnit}`;
        },
        label (tooltipItem: any, data: any) {
          return data.datasets[tooltipItem.datasetIndex].label;
        },
      },
    },
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: xAxisTitle,
        },
        stacked: true,
        gridLines: { display: false },
        ticks: { padding: 5 },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: yAxisTitle,
        },
        stacked: true,
        gridLines: { display: false },
        ticks: { display: false },
      }],
    },
    layout: {
      padding: {
        top: 20,
      },
    },
    plugins: {
      datalabels: {
        formatter (_: any, ctx: any) {
          const total = ctx.chart.$totalizer.totals[ctx.dataIndex];
          return total.toString();
        },
        align: 'end' as 'end',
        anchor: 'end' as 'end',
        display (ctx: any) {
          return ctx.datasetIndex === ctx.chart.$totalizer.utmost;
        },
      },
    },
    cornerRadius: 5,
  });
