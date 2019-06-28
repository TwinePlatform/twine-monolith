import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../../../../lib/ui/design_system';
import DataCell from './DataTableCell';
import { RowProps } from './types';
import { hashJSON } from '../../../../lib/util/hash';

/**
 * Styles
 */
const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: ${ColoursEnum.lightGrey};
  }

  &:nth-child(even) {
    background-color: ${rgba(ColoursEnum.grey, 0.2)};
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
        order.map((h) => (
          <DataCell content={columns[h].content} onClick={onClick} key={hashJSON(h)}/>
        ))
      }
    </TableRow>
  );

  return rowLink
    ? <Link to={rowLink}>{inner}</Link>
    : inner;
};

export default DataTableRow;
