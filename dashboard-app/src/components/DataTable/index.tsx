import React, { useState } from 'react';
import styled from 'styled-components';
import { Grid } from 'react-flexbox-grid';
import { ColoursEnum } from '../../styles/style_guide';
import DataTableRow, { RowProps } from './DataTableRow';
import HeaderRow from './DataTableHeaderRow';
import { DataColProps } from './DataTableCol';
import { Dictionary, equals, sortBy } from 'ramda';


type DataTableCol = {
  content: number | string,
  cellLink?: string
};

type DataTableProps = {
  headers: string[]
  rows: {
    rowLink?: string
    columns: {
      [k in string]: DataTableCol
    },
  }[],
};

const mapProps = (rows: DataTableProps['rows']) => {
  return rows.map((row, i) => ({
    ...row,
    alternateColour: i % 2 === 0,
  }));
};

const TableContainer = styled(Grid)`
  overflow: scroll;
`;


const sorter = (data: DataTableProps['rows'], order: 'desc' | 'asc', f?: string) => {
  if (!f) {
    return data;
  }

  const sorted = sortBy((a) => (a.columns[f] || {}).content, data);

  return order === 'desc' ? sorted : sorted.reverse();
};


const DataTable: React.FunctionComponent<DataTableProps> = (props) => {
  const [sortCol, setSortCol] = useState('');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const headers = props.headers.map((name) => ({
    content: name,
    onClick: () => setSortCol(name),
  }));

  return (
    <TableContainer>
      <HeaderRow columns={headers} />
      {
        mapProps(sorter(props.rows, order, sortCol))
          .map((row) => <DataTableRow {...row} order={props.headers}/>)
       }
    </TableContainer>
  );
};


export default DataTable;
