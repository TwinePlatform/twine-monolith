import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';
import { ColoursEnum } from '../../styles/style_guide';
import { HeaderRowProps } from './types';
import DataCol from './DataTableCol';


/**
 * Styles
 */
const DataRow = styled(Row)`
  background-color: ${ColoursEnum.light}
`;

/**
 * Component
 */
const DataTableRow: React.FunctionComponent<HeaderRowProps> = (props) => {
  const { columns, onClick = () => {}, active, order } = props;
  const arrow = order === 'desc' ? '↓' : '↑';

  return (
    <DataRow middle="xs">
      {
        columns
          .map((col) =>
            <DataCol
              {...col}
              onClick={onClick}
              prefix={col.content === active ? arrow : undefined}
            />
          )
      }
    </DataRow>
  );
};

export default DataTableRow;
