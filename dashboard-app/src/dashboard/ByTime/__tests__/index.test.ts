import { cleanup, waitForElement } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { renderWithHistory } from '../../../util/tests';
import { axios } from '../../../api';
import ByTime from '..';
import 'jest-dom/extend-expect';

describe('By Activity Page', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test('Success :: Display Title', async () => {
    expect.assertions(1);

    mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });

    const tools = renderWithHistory(ByTime);

    const title = await waitForElement(() => tools.getByText('By', { exact: false }));

    expect(title.textContent).toEqual('By Time');
  });
});
