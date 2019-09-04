import { cleanup, waitForElement, fireEvent, wait } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import MockDate from 'mockdate';
import { renderWithHistory } from '../../../../lib/util/tests';
import { axios } from '../../../../lib/api';
import { logs, activities } from '../../__data__/api_data';
import ByTime from '../../ByTime';
import 'jest-dom/extend-expect';


jest.mock('react-chartjs-2', () => ({ __esModule: true, default: () => null }));


describe('By Time Page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    MockDate.set('2019-06-30');
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  afterAll(() => {
    MockDate.reset();
  });

  describe('Table view', async () => {
    test('Success :: Display Title', async () => {
      expect.assertions(2);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });

      const tools = renderWithHistory(ByTime);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [title, message] = await waitForElement(() => [
        tools.getByText('Time', { exact: false }),
        tools.getByText('AVAILABLE', { exact: false }),
      ]);

      expect(title).toHaveTextContent('Time');
      expect(message).toHaveTextContent('NO DATA AVAILABLE');
    });

    test('Success :: Render data to table', async () => {
      expect.assertions(3);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
      mock.onGet('/volunteer-activities').reply(200, { result: activities });

      const tools = renderWithHistory(ByTime);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [firstHeader] = await waitForElement(() => [
        tools.getByText('↑', { exact: false }),
        tools.getByText('Total Hours', { exact: true }),
        tools.getByText('Jul 2018', { exact: true }),
        tools.getByText('Aug 2018', { exact: true }),
        tools.getByText('Sep 2018', { exact: true }),
        tools.getByText('Oct 2018', { exact: true }),
        tools.getByText('Nov 2018', { exact: true }),
        tools.getByText('Dec 2018', { exact: true }),
        tools.getByText('Jan 2019', { exact: true }),
        tools.getByText('Feb 2019', { exact: true }),
        tools.getByText('Mar 2019', { exact: true }),
        tools.getByText('Apr 2019', { exact: true }),
        tools.getByText('May 2019', { exact: true }),
        tools.getByText('Jun 2019', { exact: true }),
      ]);

      await waitForElement(() => [
        tools.getByText('Cafe', { exact: true }),
        tools.getByText('Running away', { exact: true }),
      ]);

      await waitForElement(() => tools.getByText('Totals', { exact: true }));

      const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

      expect(firstHeader).toHaveTextContent('↑ Activity');
      expect(rows[0]).toHaveTextContent('Cafe5.6600020.333.33000000');
      expect(rows[1]).toHaveTextContent('Running away1.3300000001.330000');
    });

    test('Success :: Sort on first column is ascending (A-Z) by default', async () => {
      expect.assertions(5);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
      mock.onGet('/volunteer-activities').reply(200, { result: activities });

      const tools = renderWithHistory(ByTime);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [header1, header2] = await waitForElement(() => [
        tools.getByText('Activity', { exact: false }),
        tools.getByText('Total Hours', { exact: true }),
      ]);

      expect(header1).toHaveTextContent('↑ Activity');

      fireEvent.click(header2);
      await wait();
      fireEvent.click(header1);

      const [sortedHeader, rows] = await waitForElement(() => [
        tools.getByText('Activity', { exact: false }),
        tools.getAllByTestId('data-table-row'),
      ]);

      expect(sortedHeader).toHaveTextContent('↑ Activity');
      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent('Cafe5.6600020.333.33000000');
      expect(rows[1]).toHaveTextContent('Running away1.3300000001.330000');
    });
  });

});
