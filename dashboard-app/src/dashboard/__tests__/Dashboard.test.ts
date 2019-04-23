import MockAdapter from 'axios-mock-adapter';
import {
  cleanup,
  wait,
} from 'react-testing-library';
import { renderWithHistory } from '../../util/tests';
import { axios } from '../../api';
import Dashboard from '../Dashboard';
import 'jest-dom/extend-expect';

describe('Dashboard Page', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  beforeEach(cleanup);

  afterEach(cleanup);

  test('Unauthenticated user gets redirected to login', async () => {
    expect.assertions(1);

    mock.onGet('/v1/community-businesses/me').reply(401, { error: { } });

    const tools = renderWithHistory(Dashboard);

    await wait(() => expect(tools.history.location.pathname).toEqual('/login'));
  });

  test('Unauthorized user gets redirected to login', async () => {
    expect.assertions(1);

    mock.onGet('/v1/community-businesses/me').reply(403, { error: { } });

    const tools = renderWithHistory(Dashboard);

    await wait(() => expect(tools.history.location.pathname).toEqual('/login'));
  });

  test('Internal server error redirects to error page', async () => {
    expect.assertions(1);

    mock.onGet('/v1/community-businesses/me').reply(500, { error: { } });

    const tools = renderWithHistory(Dashboard);

    await wait(() => expect(tools.history.location.pathname).toEqual('/error/500'));
  });
});
