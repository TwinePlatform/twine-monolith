import React from 'react';
import styled from 'styled-components';
import { ColoursEnum, SpacingEnum } from '../../styles/design_system';
import { TotalsRowProps, make } from './types';
import DataCell from './DataTableCell';
import { hashJSON } from '../../util/hash';


/**
 * Styles
 */
const TableRow = styled.tr`
  background-color: ${ColoursEnum.black};
  color: ${ColoursEnum.white};
`;


const DataTableTotalsRow: React.FunctionComponent<TotalsRowProps> = (props) => {
  const { rows, order } = props;
  const Aprime = make(rows);
  return (
    <TableRow>
      {
        Aprime.map((n: number) => (
          <DataCell content={n} key={n} />
        ))
      }
    </TableRow>
  );
};

export default DataTableTotalsRow;
