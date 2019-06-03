import { cleanup, waitForElement } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { renderWithHistory } from '../../../util/tests';
import { axios } from '../../../api';
import { logs, users, activities } from '../../__data__/api_data';
import ByActivity from '..';
import 'jest-dom/extend-expect';

describe('By Activity Page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test('Success :: Display title and empty table', async () => {
    expect.assertions(2);

    mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });
    mock.onGet('/community-businesses/me/volunteers').reply(200, { result: [] });
    mock.onGet('/volunteer-activities').reply(200, { result: [] });

    const tools = renderWithHistory(ByActivity);

    const [title, message] = await waitForElement(() => [
      tools.getByText('By', { exact: false }),
      tools.getByText('AVAILABLE', { exact: false }),
    ]);

    expect(title.textContent).toBe('By Activity');
    expect(message.textContent).toBe('NO DATA AVAILABLE');
  });

  test('Success :: Render data to table', async () => {
    expect.assertions(1);

    mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: logs });
    mock.onGet('/community-businesses/me/volunteers').reply(200, { result: users });
    mock.onGet('/volunteer-activities').reply(200, { result: activities });

    const tools = renderWithHistory(ByActivity);

    const [title, ...rest] = await waitForElement(() => [
      tools.getByText('By', { exact: false }),
      tools.getByText('Cafe', { exact: true }),
      tools.getByText('Running away', { exact: true }),
      tools.getByText('Betty', { exact: true }),
      tools.getByText('Wilma', { exact: true }),
    ]);

    expect(title.textContent).toBe('By Activity');
  });
});
