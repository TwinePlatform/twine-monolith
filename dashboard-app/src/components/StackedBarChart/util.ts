import { round } from '../../dashboard/dataManipulation/util';

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

export const getStackedGraphOptions = (xAxisTitle: string, yAxisTitle: string) => ({
  legend: {
    position: 'right',
    labels: {
      usePointStyle: true,
    },
  },
  scales: {
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: xAxisTitle,
      },
      stacked: true,
      gridLines: false,
      ticks: { padding: 5 },
    }],
    yAxes: [{
      scaleLabel: {
        display: true,
        labelString: yAxisTitle,
      },
      stacked: true,
      gridLines: false,
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
      align: 'end',
      anchor: 'end',
      display (ctx: any) {
        return ctx.datasetIndex === ctx.chart.$totalizer.utmost;
      },
    },
  },
});
