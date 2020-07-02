import React from 'react';
import { render, cleanup } from 'react-testing-library';
import AgeGroupChart from '../AgeGroupChart';

describe('Age Group Chart', () => {

  afterEach(cleanup);

  test('No data returns appropriate message', () => {
    const tools = render(<AgeGroupChart data={{}} />);
    const displayMessage = tools.getByText('No data', { exact: false });

    expect(displayMessage).toHaveStyle('opacity: 1');
  });

  test('Data returns chart', () => {
    const data = { datasets: [{
      data: [5, 1],
      backgroundColor: ['#47ABFA', '#379A90'],
    }] };
    const tools = render(<AgeGroupChart data={data} />);
    const displayMessage = tools.getByText('No data', { exact: false });

    expect(displayMessage).toHaveStyle('opacity: 0');
  });

});
