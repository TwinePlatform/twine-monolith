import { cleanup, waitForElement, fireEvent } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { renderWithHistory } from '../../../../lib/util/tests';
import { axios } from '../../../../lib/api';
import { logs, users, activities } from '../../__data__/api_data';
import ByActivity from '../../ByActivity';
import 'jest-dom/extend-expect';


describe('By Activity Page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test('Display title and empty table', async () => {
    expect.assertions(2);

    mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });
    mock.onGet('/community-businesses/me/volunteers').reply(200, { result: [] });
    mock.onGet('/volunteer-activities').reply(200, { result: [] });

    const tools = renderWithHistory(ByActivity);

    const [title, message] = await waitForElement(() => [
      tools.getByText('Activities', { exact: false }),
      tools.getByText('AVAILABLE', { exact: false }),
    ]);

    expect(title.textContent).toBe('Activities');
    expect(message.textContent).toBe('NO DATA AVAILABLE');
  });

  test('Render data to table', async () => {
    expect.assertions(1);

    mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
    mock.onGet('/community-businesses/me/volunteers').reply(200, { result: users });
    mock.onGet('/volunteer-activities').reply(200, { result: activities });

    const tools = renderWithHistory(ByActivity);

    const [title] = await waitForElement(() => [
      tools.getByText('Activities', { exact: false }),
      tools.getByText('Cafe', { exact: true }),
      tools.getByText('Running away', { exact: true }),
      tools.getByText('Betty', { exact: true }),
      tools.getByText('Wilma', { exact: true }),
    ]);

    expect(title).toHaveTextContent('Activity');
  });

  test('Sort on first column is ascending (A-Z) by default', async () => {
    expect.assertions(4);

    mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
    mock.onGet('/community-businesses/me/volunteers').reply(200, { result: users });
    mock.onGet('/volunteer-activities').reply(200, { result: activities });

    const tools = renderWithHistory(ByActivity);

    const header = await waitForElement(() => tools.getByText('Volunteer Name', { exact: true }));

    fireEvent.click(header);

    const [sortedHeader, rows] = await waitForElement(() => [
      tools.getByText('Volunteer Name', { exact: false }),
      tools.getAllByTestId('data-table-row'),
    ]);

    expect(sortedHeader.textContent).toBe('↑ Volunteer Name');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Betty3.3321.33');
    expect(rows[1]).toHaveTextContent('Wilma3.673.670');
  });
});
