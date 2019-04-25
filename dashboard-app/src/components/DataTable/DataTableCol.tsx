import React from 'react';
import styled from 'styled-components';
import { Col } from 'react-flexbox-grid';
import { SpacingEnum } from '../../styles/style_guide';
import { ColumnProps } from './types';


const DataCol = styled(Col)`
  padding: ${SpacingEnum.small} 0;
`;

const DataTableCol: React.FunctionComponent<ColumnProps> = (props) => {
  const { content, onClick = () => {} } = props;
  return (
    <DataCol xs onClick={() => onClick(props.content)}>
      {props.prefix || null}
      {content}
    </DataCol>
  );
};


export default DataTableCol;
