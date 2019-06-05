import { cleanup, waitForElement, fireEvent } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { renderWithHistory } from '../../../util/tests';
import { axios } from '../../../api';
import { logs, users } from '../../__data__/api_data';
import ByVolunteer from '..';
import 'jest-dom/extend-expect';


jest.mock('react-chartjs-2', () => ({ Bar: () => null }));


describe('By Volunteer Page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  describe('Table view', () => {
    test('Success :: Display Title', async () => {
      expect.assertions(2);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });
      mock.onGet('/community-businesses/me/volunteers').reply(200, { result: [] });

      const tools = renderWithHistory(ByVolunteer);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [title, message] = await waitForElement(() => [
        tools.getByText('By', { exact: false }),
        tools.getByText('AVAILABLE', { exact: false }),
      ]);

      expect(title.textContent).toBe('By Volunteer');
      expect(message.textContent).toBe('NO DATA AVAILABLE');
    });


    test('Success :: Render data to table', async () => {
      expect.assertions(3);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
      mock.onGet('/community-businesses/me/volunteers').reply(200, { result: users });

      const tools = renderWithHistory(ByVolunteer);
      const tableTab = await waitForElement(() => tools.getByText('Table', { exact: true }));
      fireEvent.click(tableTab);

      const [sortedHeader] = await waitForElement(() => [
        tools.getByText('Total Hours', { exact: false }),
        tools.getByText('Volunteer Name', { exact: true }),
        tools.getByText('Jul 18', { exact: true }),
        tools.getByText('Aug 18', { exact: true }),
        tools.getByText('Sep 18', { exact: true }),
        tools.getByText('Oct 18', { exact: true }),
        tools.getByText('Nov 18', { exact: true }),
        tools.getByText('Dec 18', { exact: true }),
        tools.getByText('Jan 19', { exact: true }),
        tools.getByText('Feb 19', { exact: true }),
        tools.getByText('Mar 19', { exact: true }),
        tools.getByText('Apr 19', { exact: true }),
        tools.getByText('May 19', { exact: true }),
        tools.getByText('Jun 19', { exact: true }),
      ]);

      await waitForElement(() => [
        tools.getByText('Betty', { exact: true }),
        tools.getByText('Wilma', { exact: true }),
      ]);

      await waitForElement(() => tools.getByText('Totals', { exact: true }));

      const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

      expect(rows[0]).toHaveTextContent('Wilma3.6600000.333.33000000');
      expect(rows[1]).toHaveTextContent('Betty3.3300020001.330000');
      expect(sortedHeader).toHaveTextContent('↓ Total Hours');
    });
  });
});
