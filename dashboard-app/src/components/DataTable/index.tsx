/*
 * DataTable component
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { sortBy, pathOr, compose } from 'ramda';
import { H3 as _H3 } from '../Headings';
import { SpacingEnum, ColoursEnum } from '../../styles/design_system';
import Card from '../Card';
import DataTableRow from './DataTableRow';
import HeaderRow from './DataTableHeaderRow';
import { DataTableProps, Order } from './types';
import { hashJSON } from '../../util/hash';


/**
 * Helpers
 */
const toValidNumber = (s: string) => isNaN(Number.parseFloat(s)) ? s : Number.parseFloat(s);

const sortRows = (data: DataTableProps['rows'], order: Order, f?: string) => {
  if (!f) {
    return data;
  }
  const getContent = compose(toValidNumber, pathOr(-1, ['columns', f, 'content']));
  const sorted = sortBy(getContent, data);
  return order === 'desc' ? sorted.reverse() : sorted;
};

/**
 * Styles
 */
const TitleContainer = styled.div`
  padding: ${SpacingEnum.small};
  background-color: ${ColoursEnum.white};
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
  text-align: left;
`;


/**
 * Component
 */
const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const {
    headers,
    rows,
    initialOrder = 'desc',
    initialSortBy = props.headers[0],
    ...rest
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
    <Card {...rest}>
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
                .map((row) => (
                  <DataTableRow
                    columns={row.columns}
                    order={headers}
                    key={hashJSON(row)}
                  />
                ))
            }
          </tbody>
        </Table>
      </Container>
    </Card>
  );
};


export default DataTable;
