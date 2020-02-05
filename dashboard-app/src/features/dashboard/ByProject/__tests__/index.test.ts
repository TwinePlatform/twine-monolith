import { cleanup, waitForElement, fireEvent } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import MockDate from 'mockdate';
import { renderWithHistory } from '../../../../lib/util/tests';
import { axios } from '../../../../lib/api';
import { logs, activities, projects } from '../../__data__/api_data';
import ByProject from '..';
import 'jest-dom/extend-expect';


jest.mock('react-chartjs-2', () => ({ __esModule: true, default: () => null }));


describe('By Project Page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    MockDate.set('2019-06-30');
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  afterAll(() => {
    MockDate.reset();
  });

  describe('Table view', () => {
    test('Display Title', async () => {
      expect.assertions(2);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });

      const tools = renderWithHistory(ByProject);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [title, message] = await waitForElement(() => [
        tools.getByText('Projects', { exact: false }),
        tools.getByText('AVAILABLE', { exact: false }),
      ]);

      expect(title).toHaveTextContent('Projects');
      expect(message).toHaveTextContent('NO DATA AVAILABLE');
    });

    test('Render data to table', async () => {
      expect.assertions(2);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
      mock.onGet('/volunteer-activities').reply(200, { result: activities });
      mock.onGet('/community-businesses/me/volunteers/projects').reply(200, { result: projects });

      const tools = renderWithHistory(ByProject);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [firstHeader] = await waitForElement(() => [
        tools.getByText('↑', { exact: false }),
        tools.getByText('Total Hours', { exact: true }),
        tools.getByText('Cafe', { exact: true }),
        tools.getByText('Running away', { exact: true }),
      ]);

      await waitForElement(() => [
        tools.getByText('General', { exact: true }),
        tools.getByText('Project 1', { exact: true }),
      ]);

      await waitForElement(() => tools.getByText('Totals', { exact: true }));

      const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

      expect(firstHeader).toHaveTextContent('↑ Project');
      expect(rows[0]).toHaveTextContent('General2.332.330');
    });

    test('Toggle between projects and activities', async () => {
      expect.assertions(3);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
      mock.onGet('/volunteer-activities').reply(200, { result: activities });
      mock.onGet('/community-businesses/me/volunteers/projects').reply(200, { result: projects });

      const tools = renderWithHistory(ByProject);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      const projActToggle = await waitForElement(() => tools.getByText('Activities', { exact: true }));
      fireEvent.click(tableTab);
      fireEvent.click(projActToggle);

      const [firstHeader] = await waitForElement(() => [
        tools.getByText('↑', { exact: false }),
        tools.getByText('Total Hours', { exact: true }),
        tools.getByText('General', { exact: true }),
        tools.getByText('Project 1', { exact: true })
      ]);

      await waitForElement(() => [
        tools.getByText('Cafe', { exact: true }),
        tools.getByText('Running away', { exact: true })
      ]);

      await waitForElement(() => tools.getByText('Totals', { exact: true }));

      const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

      expect(firstHeader).toHaveTextContent('↑ Activity');
      expect(rows[0]).toHaveTextContent('Cafe5.663.332.33');
      expect(rows[1]).toHaveTextContent('Running away1.331.330');
    });

    test('Sort on first column is ascending (A-Z) by default', async () => {
      expect.assertions(4);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
      mock.onGet('/volunteer-activities').reply(200, { result: activities });
      mock.onGet('/community-businesses/me/volunteers/projects').reply(200, { result: projects });

      const tools = renderWithHistory(ByProject);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const header = await waitForElement(() => tools.getByText('Project', { exact: false }));

      fireEvent.click(header);

      const [sortedHeader, rows] = await waitForElement(() => [
        tools.getByText('↑ Project', { exact: true }),
        tools.getAllByTestId('data-table-row'),
      ]);

      expect(sortedHeader).toHaveTextContent('↑ Project');
      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent('General2.332.330');
      expect(rows[1]).toHaveTextContent('Project 14.663.331.33');
    });
  });

});
