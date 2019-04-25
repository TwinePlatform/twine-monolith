import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import { ColoursEnum } from '../../styles/style_guide';
import DataCol, { DataColProps } from './DataTableCol';


/**
 * Types
 */
export type RowProps = {
  columns: DataColProps[]
  onClick?: () => void
};


/**
 * Styles
 */
const DataRow = styled(Row)`
  background-color: ${ColoursEnum.light}
`;

/**
 * Component
 */
const DataTableRow: React.FunctionComponent<RowProps> = (props) => {
  const { columns, onClick = () => {} } = props;

  return (
    <DataRow>
      { columns.map((col) => <DataCol {...col} onClick={onClick}/>) }
    </DataRow>
  );
};

export default DataTableRow;
