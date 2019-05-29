import React from 'react';
import { cleanup, render, waitForElement, fireEvent } from 'react-testing-library';
import { TabGroup } from '../TabGroup';
import 'jest-dom/extend-expect';


describe('TabGroup', () => {
  afterEach(cleanup);

  test('renders first tab by default', async () => {
    expect.assertions(2);

    const tools = render(
      <TabGroup titles={['one', 'two']}>
        <div>
          This is the first tab content
        </div>
        <div>
          This is the second tab content
        </div>
      </TabGroup>
    );

    const tabContent = await waitForElement(() => tools.getByText('This is the first tab content'));
    const findSecondTab = async () =>
      await waitForElement(() => tools.getByText('This is the second tab content'))

    expect(tabContent).toHaveTextContent('This is the first tab content');

    try {
      await findSecondTab();
    } catch (error) {
      expect(error.message
        .includes('Unable to find an element with the text: This is the second tab content.')
      ).toBe(true);
    }
  });
});
