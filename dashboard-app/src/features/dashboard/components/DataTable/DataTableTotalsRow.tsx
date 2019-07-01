import React from 'react';
import styled from 'styled-components';
import { ColoursEnum } from '../../../../lib/ui/design_system';
import { TotalsRowProps } from './types';
import { calculateTotals, formatNumber } from './util';
import DataCell from './DataTableCell';


/**
 * Styles
 */
const TableRow = styled.tr`
  background-color: ${ColoursEnum.black};
  color: ${ColoursEnum.white};
`;


const DataTableTotalsRow: React.FunctionComponent<TotalsRowProps> = ({ rows }) => {
  const totals = calculateTotals(rows);

  return (
    <TableRow data-testid="data-table-totals-row">
      {
        totals.map((n: number, idx: number) =>
          idx === 0
            ? <DataCell content={'Totals'} key={n} />
            : <DataCell content={isNaN(n) ? '' : formatNumber(n)} key={`${n}${idx}`} />
        )
      }
    </TableRow>
  );
};

export default DataTableTotalsRow;
