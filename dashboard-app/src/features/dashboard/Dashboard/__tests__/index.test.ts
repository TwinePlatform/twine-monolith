import { cleanup, waitForElement, fireEvent, wait } from 'react-testing-library';
import Dashboard from '../../Dashboard';
import 'jest-dom/extend-expect';
import { renderWithHistory } from '../../../../lib/util/tests';

describe('Dashboard Page', () => {
  afterEach(cleanup);

  test('Render', async () => {
    const tools = renderWithHistory(Dashboard);

    await waitForElement(() => [
      tools.getByText('Activities'),
      tools.getByText('Time'),
      tools.getByText('Volunteers'),
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

  test('Clicking activity goes to /activities', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Dashboard);
    const buttons = await waitForElement(() => tools.getAllByText('View data'));
    fireEvent.click(buttons[1]);

    await wait(() => expect(tools.history.location.pathname).toBe('/activities'));
  });

  test('Clicking volunteer goes to /volunteers', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Dashboard);
    const buttons = await waitForElement(() => tools.getAllByText('View data'));
    fireEvent.click(buttons[2]);

    await wait(() => expect(tools.history.location.pathname).toBe('/volunteers'));
  });
});
