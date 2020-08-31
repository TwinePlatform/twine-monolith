/*
 * DataTable component
 */
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { pathOr } from 'ramda';
import { Order, sort } from 'twine-util/arrays';
import Card from '../../../../lib/ui/components/Card';
import UsersDataTableRow from './UsersDataTableRow';
import HeaderRow from './DataTableHeaderRow';
import { UsersDataTableProps } from './types';
import { hashJSON } from '../../../../lib/util/hash';
import { FullWidthTextBox } from '../../../../lib/ui/components/FullWidthTextBox';


/*
 * Styles
 */
const Container = styled.div`
  overflow: auto;
  max-width: calc(100vw - 7em);
`;

const Table = styled.table`
  overflow-x: scroll;
  text-align: left;
  table-layout: fixed;
  width: ${(props: { cols: number }) => props.cols * 10}rem;
`;

/*
 * Component
 */
const UsersDataTable: React.FunctionComponent<UsersDataTableProps> = (props) => {
    const {
    headers,
    rows,
    sortBy = headers[0],
    order = 'desc',
    onChangeSortBy = () => { },
    title,
    showTotals = false,
    ...rest
  } = props;

  const onHeaderClick = useCallback((title) => {
    onChangeSortBy(title);
  }, [onChangeSortBy]);

  const sorter = useCallback((_rows: UsersDataTableProps['rows']) =>
    sort([
      { accessor: pathOr('', ['columns', sortBy, 'content']), order },
      { accessor: pathOr('', ['columns', headers[0], 'content']), order: 'asc' as Order },
    ], _rows)
    , [sortBy, order, headers]);


  const table = (
    //<Table cols={headers.length}>
    <Table cols={8}>
      <HeaderRow
        columns={headers.map((name) => ({ content: name }))}
        order={order}
        sortBy={sortBy}
        onClick={onHeaderClick}
      />
      <tbody>
        {
          sorter(rows)
            .map((row,index) => {(
              <UsersDataTableRow
                columns={row.columns}
                order={headers}
                key={hashJSON(row)}
              />
            )})
        }
      </tbody>
    </Table>
  );

  return (
    <Card {...rest}>
      <Container>
        {
          rows.length > 0
            ? table
            : <FullWidthTextBox text="NO DATA AVAILABLE" />
        }
      </Container>
    </Card>
  );
};


export default UsersDataTable;
