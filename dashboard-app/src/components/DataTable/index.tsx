/*
 * DataTable component
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { sortBy, pathOr } from 'ramda';
import { H3 as _H3 } from '../Headings';
import { SpacingEnum } from '../../styles/style_guide';
import Card from '../Card';
import DataTableRow from './DataTableRow';
import HeaderRow from './DataTableHeaderRow';
import { DataTableProps, Order } from './types';


/**
 * Helpers
 */
const sortRows = (data: DataTableProps['rows'], order: Order, f?: string) => {
  if (!f) {
    return data;
  }
  const sorted = sortBy(pathOr(-1, ['columns', f, 'content']), data);
  return order === 'desc' ? sorted.reverse() : sorted;
};

/**
 * Styles
 */
const TitleContainer = styled.div`
  padding: ${SpacingEnum.small};
`;

const H3 = styled(_H3)`
  text-align: left;
`;

const Container = styled.div`
  overflow: auto;
  max-width: calc(100vw - 7em);
`;

const Table = styled.table`
  overflow-x: scroll;
`;


/**
 * Component
 */
const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const {
    headers,
    rows,
    initialOrder = 'desc',
    initialSortBy = props.headers[0]
  } = props;

  const [order, setOrder] = useState<Order>(initialOrder);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);

  const onHeaderClick = useCallback((title) => {
    if (sortBy === title) { // toggling order
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else { // sorting by new column
      setSortBy(title);
      setOrder('desc');
    }
  }, [order, sortBy]);

  return (
    <Card>
      {
        props.title && <TitleContainer><H3>{props.title}</H3></TitleContainer>
      }
      <Container>
        <Table>
          <HeaderRow
            columns={headers.map((name) => ({ content: name }))}
            order={order}
            sortBy={sortBy}
            onClick={onHeaderClick}
          />
          <tbody>
            {
              sortRows(rows, order, sortBy)
                .map((row) => <DataTableRow columns={row.columns} order={headers}/>)
            }
          </tbody>
        </Table>
      </Container>
    </Card>
  );
};


export default DataTable;
