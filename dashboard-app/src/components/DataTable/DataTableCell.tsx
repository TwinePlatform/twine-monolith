import React from 'react';
import styled from 'styled-components';
import { SpacingEnum } from '../../styles/style_guide';
import { CellProps } from './types';


const Cell = styled.td`
  padding: ${SpacingEnum.small} 0;
`;


const DataTableCell: React.FunctionComponent<CellProps> = (props) => {
  const { content, onClick = () => {} } = props;
  return (
    <Cell onClick={() => onClick(content)}>
      {content}
    </Cell>
  );
};


export default DataTableCell;
