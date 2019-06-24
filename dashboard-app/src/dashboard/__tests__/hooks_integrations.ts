import { cleanup, waitForElement, fireEvent, act } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { renderWithHistory } from '../../util/tests';
import { axios } from '../../api';
import { users, activities } from '../__data__/api_data';
import ByActivity from '../ByActivity';
import 'jest-dom/extend-expect';

describe('Integrated Hooks Tests', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);
  describe('useErrors', () => {
    test('Success :: Displays error if attempt to download no data', async () => {
      expect.assertions(1);

      mock.onGet('/community-businesses/me/volunteer-logs').reply(200, { result: [] });
      mock.onGet('/community-businesses/me/volunteers').reply(200, { result: users });
      mock.onGet('/volunteer-activities').reply(200, { result: activities });


        /* fire events that update state */
      const tools = renderWithHistory(ByActivity);

      const [downloadButton] = await waitForElement(() => [
        tools.getByText('Download Csv'),
      ]);

        // await fireEvent.click(downloadButton);
        // const errorMessage = await waitForElement(() => {
        //   console.log('hi');
        //   return tools.getByText('is no data available', { exact: false });
        // });

      expect(downloadButton.textContent).toBe('Download: There is no data available to download');


    });
  });
});
