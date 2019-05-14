import { cleanup, waitForElement, fireEvent, wait } from 'react-testing-library';
import Dashboard from '../Dashboard';
import 'jest-dom/extend-expect';
import { renderWithHistory } from '../../util/tests';

describe('Dashboard Page', () => {
  afterEach(cleanup);

  test('Render', async () => {
    const tools = renderWithHistory(Dashboard);

    await waitForElement(() => [
      tools.getByText('Activity'),
      tools.getByText('Time'),
      tools.getByText('Volunteer'),
      tools.getByText('Projects'),
    ]);
  });

  test('Clicking time goes to /time', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Dashboard);
    const buttons = await waitForElement(() => tools.getAllByText('View data'));
    fireEvent.click(buttons[0]);

    await wait(() => expect(tools.history.location.pathname).toBe('/time'));
  });

  test('Clicking activity goes to /activity', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Dashboard);
    const buttons = await waitForElement(() => tools.getAllByText('View data'));
    fireEvent.click(buttons[1]);

    await wait(() => expect(tools.history.location.pathname).toBe('/activity'));
  });

  test('Clicking volunteer goes to /volunteer', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Dashboard);
    const buttons = await waitForElement(() => tools.getAllByText('View data'));
    fireEvent.click(buttons[2]);

    await wait(() => expect(tools.history.location.pathname).toBe('/volunteer'));
  });
});
