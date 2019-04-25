import React from 'react';
import styled from 'styled-components';
import { Col } from 'react-flexbox-grid';
import { ColoursEnum, SpacingEnum } from '../../styles/style_guide';


export type DataColProps = {
  content: string | number | symbol
  cellLink?: string
  onClick?: (f: DataColProps['content']) => void
};


const DataCol = styled(Col)`
  padding: ${SpacingEnum.small} 0;
`;

const DataTableCol: React.FunctionComponent<DataColProps> = (props) => {
  const { content, onClick = () => {} } = props;
  return (
    <DataCol xs onClick={() => onClick(props.content)}>
      {content}
    </DataCol>
  );
};


export default DataTableCol;
