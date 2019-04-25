/*
 * DataTable component
 */
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Grid } from 'react-flexbox-grid';
import { sortBy, pathOr } from 'ramda';
import { H3 as _H3 } from '../Headings';
import { SpacingEnum } from '../../styles/style_guide';
import Card from '../Card';
import DataTableRow from './DataTableRow';
import HeaderRow from './DataTableHeaderRow';
import { DataTableProps, DataTableContent, Order } from './types';


/**
 * Helpers
 */
const mapProps = (rows: DataTableProps['rows']) =>
  rows.map((row, i) => ({ ...row, alternateColour: i % 2 === 0 }));

const sortRows = (data: DataTableProps['rows'], order: Order, f?: string) => {
  if (!f) {
    return data;
  }
  const sorted = sortBy(pathOr(-1, ['columns', f, 'content']), data);
  return order === 'desc' ? sorted.reverse() : sorted;
};

const toggleOrder = (o: Order) => o === 'desc' ? 'asc' : 'desc';


/**
 * Styles
 */
const TableContainer = styled(Grid)`
  overflow: scroll;
`;

const TitleContainer = styled.div`
  padding: ${SpacingEnum.small} ${SpacingEnum.small};
`;

const H3 = styled(_H3)`
  text-align: left;
`;


/**
 * Component
 */
const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const headers = props.headers.map((name) => ({ content: name }));

  const [sortCol, setSortCol] = useState(props.initialSortColumn || headers[0].content);
  const [order, setOrder] = useState<Order>(props.initialOrder || 'desc');

  const onClick = useCallback((colName: DataTableContent) => {
    setOrder(colName === sortCol ? toggleOrder(order) : 'desc');
    setSortCol(String(colName));
  }, [order, sortCol]);

  return (
    <Card>
      {
        props.title && <TitleContainer><H3>{props.title}</H3></TitleContainer>
      }
      <TableContainer>
        <HeaderRow
          columns={headers}
          active={sortCol}
          order={order}
          onClick={onClick}
        />
        {
          mapProps(sortRows(props.rows, order, sortCol))
            .map((row) => <DataTableRow {...row} order={props.headers}/>)
        }
      </TableContainer>
    </Card>
  );
};


export default DataTable;
