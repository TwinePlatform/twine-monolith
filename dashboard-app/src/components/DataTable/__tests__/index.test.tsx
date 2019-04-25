import React from 'react';
import { cleanup, render, waitForElement, fireEvent } from 'react-testing-library';
import DataTable from '..';
import 'jest-dom/extend-expect';


describe('Component :: DataTable', () => {
  afterEach(cleanup);

  const props = {
    title: 'Data Table Title',
    headers: [
      'one',
      'two',
      'three',
    ],
    initialSortColumn: 'one',
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

  test('Render table', async () => {
    const tools = render(<DataTable {...props}/>);

    const [
      col1, col2, col3,
      cell1, cell2, cell3, cell4, cell5, cell6,
      cell7, cell8, cell9, cell10, cell11, cell12,
    ] = await waitForElement(() => [
      tools.getByText('one', { exact: false }),
      tools.getByText('two', { exact: false }),
      tools.getByText('three', { exact: false }),
      tools.getByText('foo', { exact: false }),
      tools.getByText('bar', { exact: false }),
      tools.getByText('baz', { exact: false }),
      tools.getByText('bax', { exact: false }),
      tools.getByText('2', { exact: false }),
      tools.getByText('3', { exact: false }),
      tools.getByText('4', { exact: false }),
      tools.getByText('5', { exact: false }),
      tools.getByText('6', { exact: false }),
      tools.getByText('7', { exact: false }),
      tools.getByText('8', { exact: false }),
      tools.getByText('9', { exact: false }),
    ]);

    expect(col1).toHaveTextContent('↓one');
    expect(col2).toHaveTextContent('two');
    expect(col3).toHaveTextContent('three');

    expect(cell1).toHaveTextContent('foo');
    expect(cell2).toHaveTextContent('bar');
    expect(cell3).toHaveTextContent('baz');
    expect(cell4).toHaveTextContent('bax');
    expect(cell5).toHaveTextContent('2');
    expect(cell6).toHaveTextContent('3');
    expect(cell7).toHaveTextContent('4');
    expect(cell8).toHaveTextContent('5');
    expect(cell9).toHaveTextContent('6');
    expect(cell10).toHaveTextContent('7');
    expect(cell11).toHaveTextContent('8');
    expect(cell12).toHaveTextContent('9');
  });

  test('Alter sort order', async () => {
    const tools = render(<DataTable {...props}/>);

    const [header, rows] = await waitForElement(() => [
      tools.getByText('one', { exact: false }),
      tools.getAllByTestId('data-table-row'),
    ]);

    fireEvent.click(header);

    expect(header).toHaveTextContent('↑one');
    expect(rows[0]).toHaveTextContent('bar45');
    expect(rows[1]).toHaveTextContent('bax89');
    expect(rows[2]).toHaveTextContent('baz67');
    expect(rows[3]).toHaveTextContent('foo23');
  });

  test('Sort on different column', async () => {
    const tools = render(<DataTable {...props}/>);

    const [header1, header2, rows] = await waitForElement(() => [
      tools.getByText('one', { exact: false }),
      tools.getByText('two', { exact: false }),
      tools.getAllByTestId('data-table-row'),
    ]);

    fireEvent.click(header2);

    expect(header1).toHaveTextContent('one');
    expect(header2).toHaveTextContent('↓two');
    expect(rows[0]).toHaveTextContent('bax89');
    expect(rows[1]).toHaveTextContent('baz67');
    expect(rows[2]).toHaveTextContent('bar45');
    expect(rows[3]).toHaveTextContent('foo23');
  });
});
