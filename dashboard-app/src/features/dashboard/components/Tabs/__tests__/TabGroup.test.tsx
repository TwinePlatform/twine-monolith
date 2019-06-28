import React from 'react';
import { cleanup, render, waitForElement, fireEvent } from 'react-testing-library';
import { TabGroup } from '../TabGroup';
import 'jest-dom/extend-expect';


describe('TabGroup', () => {
  const TabOne = {
    title: 'one',
    text: 'This is the first tab content',
    content: () => <div>{TabOne.text}</div>,
  };
  const TabTwo = {
    title: 'two',
    text: 'This is the second tab content',
    content: () => <div>{TabTwo.text}</div>,
  };
  type Args = { shown: typeof TabOne, hidden: typeof TabOne, ctx: any };
  const makeTabAssertions = async ({ shown, hidden, ctx }: Args) => {
    const tabContent =
    await waitForElement(() => ctx.getByText(shown.text));
    const findOtherTab = async () =>
      await waitForElement(() => ctx.getByText(hidden.text), { timeout: 500 });

    expect(tabContent).toHaveTextContent(shown.text);

    try {
      await findOtherTab();
    } catch (error) {
      expect(error.message
        .includes(`Unable to find an element with the text: ${hidden.text}.`)
      ).toBe(true);
    }
  };

  afterEach(cleanup);

  test('renders first tab by default', async () => {
    expect.assertions(2);

    const tools = render(
      <TabGroup titles={[TabOne.title, TabTwo.title]}>
        {TabOne.content()}
        {TabTwo.content()}
      </TabGroup>
    );

    await makeTabAssertions({ shown: TabOne, hidden: TabTwo, ctx: tools });
  });

  test('renders tab based on prop', async () => {
    expect.assertions(2);

    const tools = render(
      <TabGroup titles={[TabOne.title, TabTwo.title]} initialActiveTab={1}>
        {TabOne.content()}
        {TabTwo.content()}
      </TabGroup>
    );

    await makeTabAssertions({ shown: TabTwo, hidden: TabOne, ctx: tools });
  });

  test('select tab to render on click', async () => {
    expect.assertions(6);

    const tools = render(
      <TabGroup titles={[TabOne.title, TabTwo.title]}>
        {TabOne.content()}
        {TabTwo.content()}
      </TabGroup>
    );

    const [tabOne, tabTwo] = await waitForElement(() => [
      tools.getByText('one'),
      tools.getByText('two'),
    ]);

    await makeTabAssertions({ shown: TabOne, hidden: TabTwo, ctx: tools });

    fireEvent.click(tabTwo);

    await makeTabAssertions({ shown: TabTwo, hidden: TabOne, ctx: tools });

    fireEvent.click(tabOne);

    await makeTabAssertions({ shown: TabOne, hidden: TabTwo, ctx: tools });
  });
});
