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
    orderable,
    onChangeSortBy = () => {},
    title,
    showTotals = false,
    ...rest
  } = props;

  const onHeaderClick = useCallback((title) => {
    onChangeSortBy(title);
  }, [orderable, headers]);

  const sorter = useCallback((_rows: DataTableProps['rows']) =>
    sort([
      {
        accessor: pathOr('', ['columns', orderable.sortByIndex, 'content']),
        order: orderable.order,
      },
      { accessor: pathOr('', ['columns', headers[0], 'content']), order: 'asc' as Order },
    ], _rows)
  , [orderable, headers]);

  const table = (
    <Table cols={headers.length}>
      <HeaderRow
        columns={headers.map((name) => ({ content: name }))}
        order={orderable.order}
        sortBy={orderable.sortByIndex}
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
