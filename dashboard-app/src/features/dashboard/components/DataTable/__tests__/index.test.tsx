import React from 'react';
import { cleanup, render, waitForElement, fireEvent } from 'react-testing-library';
import DataTable from '..';
import 'jest-dom/extend-expect';
import { TitleString } from '../../Title';


describe('Component :: DataTable', () => {
  afterEach(cleanup);

  const props = {
    title: ['Data Table Title', ''] as TitleString,
    headers: [
      'one',
      'two',
      'three',
    ],
    rows: [
      {
        columns: {
          one: { content: 'foo' },
          two: { content: 2 },
          three: { content: 3 },
        },
      },
      {
        columns: {
          one: { content: 'bar' },
          two: { content: 4 },
          three: { content: 5 },
        },
      },
      {
        columns: {
          one: { content: 'baz' },
          two: { content: 6 },
          three: { content: 7 },
        },
      },
      {
        columns: {
          one: { content: 'bax' },
          two: { content: 8 },
          three: { content: 9 },
        },
      },
    ],
  };

  test('Render table :: default', async () => {
    const tools = render(<DataTable {...props} />);

    const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

    expect(rows[0]).toHaveTextContent('foo23');
    expect(rows[1]).toHaveTextContent('baz67');
    expect(rows[2]).toHaveTextContent('bax89');
    expect(rows[3]).toHaveTextContent('bar45');
  });

  test('Toggle sort order on default column', async () => {
    const tools = render(<DataTable {...props} />);
    const header = await waitForElement(() => tools.getByText('one', { exact: false }));

    fireEvent.click(header);

    const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

    expect(header).toHaveTextContent('↓ one');
    expect(rows[0]).toHaveTextContent('foo23');
    expect(rows[1]).toHaveTextContent('baz67');
    expect(rows[2]).toHaveTextContent('bax89');
    expect(rows[3]).toHaveTextContent('bar45');
  });

  test('Choose different column to sort by', async () => {
    const tools = render(<DataTable {...props} sortBy="two" />);

    const header = await waitForElement(() => tools.getByText('two', { exact: false }));
    const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

    expect(header).toHaveTextContent('↓ two');
    expect(rows[0]).toHaveTextContent('bax89');
    expect(rows[1]).toHaveTextContent('baz67');
    expect(rows[2]).toHaveTextContent('bar45');
    expect(rows[3]).toHaveTextContent('foo23');
  });

  test('Toggling header updates parent state', async () => {
    const onChangeSortBy = jest.fn(() => {});
    const tools = render(<DataTable
      {...props}
      sortBy="two"
      order="desc"
      onChangeSortBy={onChangeSortBy}
      />);
    const header = await waitForElement(() => tools.getByText('two', { exact: false }));
    expect(header).toHaveTextContent('↓ two');

    fireEvent.click(header);
    expect(onChangeSortBy.mock.calls).toHaveLength(1);
    expect(onChangeSortBy.mock.calls[0]).toEqual(['two']);
  });

  test('Empty table displays "empty" message', async () => {
    const tools = render(<DataTable {...props } rows={[]} sortBy="two" />);

    const message = await waitForElement(() => tools.getByText('NO DATA AVAILABLE'));

    expect(message).toHaveTextContent('NO DATA AVAILABLE');
  });

  test('Display totals row', async () => {
    const tools = render(<DataTable {...props} sortBy="one" showTotals />);
    const rows = await waitForElement(() => tools.getAllByTestId('data-table-totals-row'));

    expect(rows).toHaveLength(1);
    expect(rows[0]).toHaveTextContent('Totals2024');
  });

  test('Secondary sort by first header', async () => {
    // Update props so that two values of the primary sort column "two"
    // have the same value, so that the secondary sort becomes significant
    const _props = {
      ...props,
      rows: [
        ...props.rows.slice(0, 3),
        {
          columns: {
            ...props.rows[3].columns,
            two: { content: 6 },
          },
        },
      ],
    };
    const tools = render(<DataTable {..._props} sortBy="two" />);
    const header = await waitForElement(() => tools.getByText('two', { exact: false }));
    const rows = await waitForElement(() => tools.getAllByTestId('data-table-row'));

    expect(header).toHaveTextContent('↓ two');
    expect(rows[0]).toHaveTextContent('bax69');
    expect(rows[1]).toHaveTextContent('baz67');
    expect(rows[2]).toHaveTextContent('bar45');
    expect(rows[3]).toHaveTextContent('foo23');
  });
});
