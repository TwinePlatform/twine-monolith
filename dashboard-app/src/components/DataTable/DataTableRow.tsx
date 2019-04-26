import React from 'react';
import styled from 'styled-components';
import { Cell } from 'styled-css-grid';
import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../../styles/style_guide';
import DataCell from './DataTableCell';
import { RowProps } from './types';


/**
 * Helpers
 */
const pickRowColor = (props: Pick<RowProps, 'alternateColour'>) => {
  if (props.alternateColour) {
    return rgba(ColoursEnum.light, 0.2);
  } else {
    return ColoursEnum.offWhite;
  }
};

/**
 * Styles
 */
const DataRow = styled(Cell)`
  background-color: ${pickRowColor};
  flex-wrap: nowrap;
`;

/**
 * Component
 */
const DataTableRow: React.FunctionComponent<RowProps> = (props) => {
  const { columns, rowLink, order, ...rest } = props;

  const inner = (
    <DataRow {...rest} data-testid="data-table-row" style={{ flexWrap: 'nowrap' }}>
      { order.map((col) => <DataCell {...columns[col]} colour={pickRowColor(rest)}/>) }
    </DataRow>
  );

  return rowLink
    ? <Link to={rowLink}>{inner}</Link>
    : inner;
};

export default DataTableRow;
