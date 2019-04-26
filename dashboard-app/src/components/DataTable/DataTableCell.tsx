import React from 'react';
import styled from 'styled-components';
import { Cell } from 'styled-css-grid';
import { SpacingEnum } from '../../styles/style_guide';
import { CellProps } from './types';


const DataCol = styled(Cell)`
  padding: ${SpacingEnum.small} 0;
  background-color: ${(props: Pick<CellProps, 'colour'>) => props.colour};
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DataTableCol: React.FunctionComponent<CellProps> = (props) => {
  const { content, onClick = () => {}, colour, prefix } = props;
  return (
    <DataCol onClick={() => onClick(content)} colour={colour}>
      {prefix || null}
      {content}
    </DataCol>
  );
};


export default DataTableCol;
