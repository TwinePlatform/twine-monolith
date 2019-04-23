import {
  cleanup,
} from 'react-testing-library';
import { renderWithHistory } from '../../util/tests';
import ByVolunteer from '../ByVolunteer';
import 'jest-dom/extend-expect';

describe.skip('By Activity Page', () => {
  beforeEach(cleanup);

  afterEach(cleanup);

  test('Success :: Display Title', async () => {
    expect.assertions(1);
    const tools = renderWithHistory(ByVolunteer);

    const title = await tools.getByText('By', { exact: false });

    expect(title.textContent).toEqual('By Volunteer');
  });
});
