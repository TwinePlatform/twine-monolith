/*
 * DataTable component
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { pathOr } from 'ramda';
import { Order, sort } from 'twine-util/arrays';
import Card from '../../../../lib/ui/components/Card';
import DataTableRow from './DataTableRow';
import HeaderRow from './DataTableHeaderRow';
import TotalsRow from './DataTableTotalsRow';
import { DataTableProps } from './types';
import { toRowProps } from './util';
import { hashJSON } from '../../../../lib/util/hash';
import { FullWidthTextBox } from '../../../../lib/ui/components/FullWidthTextBox';
import { Title } from '../Title';


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
const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const {
    headers,
    rows,
    initialOrder = 'desc',
    sortBy = props.headers[0],
    onChangeSortBy = () => {},
    title,
    showTotals = false,
    ...rest
  } = props;

  const [order, setOrder] = useState<Order>(initialOrder);

  const onHeaderClick = useCallback((title) => {
    if (sortBy === title) { // toggling order
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else { // sorting by new column
      const order = onChangeSortBy(title);
      setOrder(order || 'desc');
    }
  }, [order, sortBy, headers]);

  const sorter = useCallback((_rows: DataTableProps['rows']) =>
    sort([
      { accessor: pathOr('', ['columns', sortBy, 'content']), order },
      { accessor: pathOr('', ['columns', headers[0], 'content']), order: 'asc' as Order },
    ], _rows)
  , [order, sortBy, headers]);

  const table = (
    <Table cols={headers.length}>
      <HeaderRow
        columns={headers.map((name) => ({ content: name }))}
        order={order}
        sortBy={sortBy}
        onClick={onHeaderClick}
      />
      <tbody>
        {
          sorter(rows)
            .map((row) => (
              <DataTableRow
                columns={row.columns}
                order={headers}
                key={hashJSON(row)}
              />
            ))
        }
        {
          showTotals && <TotalsRow rows={rows.map((r) => toRowProps(r, headers))} />
        }
      </tbody>
    </Table>
  );

  return (
    <Card {...rest}>
      {
        title && <Title title={title}></Title>
      }
      <Container>
        {
          rows.length > 0
            ? table
            : <FullWidthTextBox text="NO DATA AVAILABLE"/>
        }
      </Container>
    </Card>
  );
};


export default DataTable;
