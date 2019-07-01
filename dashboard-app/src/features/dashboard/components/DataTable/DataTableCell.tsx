import React from 'react';
import styled from 'styled-components';
import { SpacingEnum } from '../../../../lib/ui/design_system';
import { CellProps } from './types';


const Cell = styled.td`
  padding: ${SpacingEnum.small};
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
