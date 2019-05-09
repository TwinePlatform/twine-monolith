import {
  cleanup,
} from 'react-testing-library';
import { renderWithHistory } from '../../util/tests';
import ByActivity from '../ByActivity/index';
import 'jest-dom/extend-expect';

describe('By Activity Page', () => {
  beforeEach(cleanup);

  afterEach(cleanup);

  test('Success :: Display Title', async () => {
    expect.assertions(1);
    const tools = renderWithHistory(ByActivity);

    const title = await tools.getByText('By', { exact: false });

    expect(title.textContent).toEqual('By Activity');
  });
});
