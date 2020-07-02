import React from 'react';
import { render, cleanup } from 'react-testing-library';
import HorizontalDrillDownChart from '../HorizontalDrillDownChart';

describe('Horizontal Drill Down Chart', () => {

  afterEach(cleanup);

  test('No data returns appropriate message', () => {
    const props = {
      drillDown: false,
      selected: '',
      levelOneData: { labels: [], datasets: [] },
      levelTwoData: {},
      options: { stepSize: 1 },
      onClick: () => {},
      basis: 'Visits',
    };

    const tools = render(<HorizontalDrillDownChart {...props} />);
    const displayMessage = tools.getByText('No data', { exact: false });

    expect(displayMessage).toHaveStyle('opacity: 1');
  });

  test('Data returns chart first step chart', () => {
    const props = {
      drillDown: false,
      selected: '',
      levelOneData: { labels: [], datasets: [{ data: [0, 0, 1] }] },
      levelTwoData: {},
      options: { stepSize: 1 },
      onClick: () => {},
      basis: 'Visits',
    };

    const tools = render(<HorizontalDrillDownChart {...props} />);
    const displayMessage = tools.getByText('No data', { exact: false });

    expect(displayMessage).toHaveStyle('opacity: 0');
  });

});
