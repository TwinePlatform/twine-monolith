import MockAdapter from 'axios-mock-adapter';
import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import { renderWithHistory } from '../../util/tests';
import ByTime from '../ByTime';
import 'jest-dom/extend-expect';

describe.skip('By Activity Page', () => {
  beforeEach(cleanup);

  afterEach(cleanup);

  test('Success :: Display Title', async () => {
    expect.assertions(1);
    const tools = renderWithHistory(ByTime);

    const title = await tools.getByText('By', { exact: false });

    expect(title.textContent).toEqual('By Time');
  });
});
