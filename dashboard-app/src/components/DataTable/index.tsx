/*
 * DataTable component
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Order, sort } from 'twine-util/arrays';
import { H3 } from '../Headings';
import { SpacingEnum, ColoursEnum } from '../../styles/design_system';
import Card from '../Card';
import DataTableRow from './DataTableRow';
import HeaderRow from './DataTableHeaderRow';
import TotalsRow from './DataTableTotalsRow';
import { DataTableProps } from './types';
import { toRowProps } from './util';
import { hashJSON } from '../../util/hash';
import { FullWidthTextBox } from '../FullWidthTextBox';


/**
 * Styles
 */
const TitleContainer = styled.div`
  padding: ${SpacingEnum.small};
  background-color: ${ColoursEnum.white};
`;

const Title = styled(H3)`
  text-align: left;
  margin-bottom: 0;
`;

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

/**
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
      onChangeSortBy(title);
      setOrder('desc');
    }
  }, [order, sortBy, headers]);

  const sorter = useCallback(() => {
    return sort([
      { path: ['columns', sortBy, 'content'], order },
      { path: ['columns', headers[0], 'content'], order: 'asc' },
    ], rows);
  }, [order, sortBy, headers, rows]);

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
          sorter()
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
        title && <TitleContainer><Title>{title}</Title></TitleContainer>
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
