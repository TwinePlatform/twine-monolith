import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';
import { rgba } from 'polished';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../../styles/style_guide';
import DataCol, { DataColProps } from './DataTableCol';


/**
 * Types
 */
export type RowProps = {
  order: string[]
  alternateColour: boolean
  columns: {
    [k in string]: DataColProps
  },
  rowLink?: string
};

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
const DataRow = styled(Row)`
  background-color: ${pickRowColor}
`;

/**
 * Component
 */
const DataTableRow: React.FunctionComponent<RowProps> = (props) => {
  const { columns, rowLink, order, ...rest } = props;

  const inner = (
    <DataRow {...rest} >
      { order.map((col) => <DataCol {...columns[col]}/>) }
    </DataRow>
  );

  return rowLink
    ? <Link to={rowLink}>{inner}</Link>
    : inner;
};

export default DataTableRow;
