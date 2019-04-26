import React from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';
import { ColoursEnum } from '../../styles/style_guide';
import { HeaderRowProps } from './types';
import DataCell from './DataTableCell';


/**
 * Styles
 */
const DataRow = styled(Row)`
  background-color: ${ColoursEnum.light};
  flex-wrap: nowrap;
`;

/**
 * Component
 */
const DataTableRow: React.FunctionComponent<HeaderRowProps> = (props) => {
  const { columns, onClick = () => {}, active, order } = props;
  const arrow = order === 'desc' ? '↓' : '↑';

  return (
    <DataRow middle="xs" style={{ flexWrap: 'nowrap', width: 'fit-content' }}>
      {
        columns
          .map((col) =>
            <DataCell
              {...col}
              onClick={onClick}
              prefix={col.content === active ? arrow : undefined}
              colour={ColoursEnum.light}
            />
          )
      }
    </DataRow>
  );
};

export default DataTableRow;
