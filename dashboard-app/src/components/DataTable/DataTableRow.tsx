import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../../styles/style_guide';
import DataCell from './DataTableCell';
import { RowProps } from './types';
import { hashJSON } from '../../util/hash';

/**
 * Styles
 */
const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${ColoursEnum.offWhite};
  }

  &:nth-child(even) {
    background-color: ${rgba(ColoursEnum.light, 0.2)};
  }
`;

/**
 * Component
 */
const DataTableRow: React.FunctionComponent<RowProps> = (props) => {
  const { columns, rowLink, order, onClick } = props;

  const inner = (
    <TableRow data-testid="data-table-row">
      {
        order.map((h) => <DataCell content={columns[h].content} onClick={onClick} key={hashJSON(h)}/>)
      }
    </TableRow>
  );

  return rowLink
    ? <Link to={rowLink}>{inner}</Link>
    : inner;
};

export default DataTableRow;
