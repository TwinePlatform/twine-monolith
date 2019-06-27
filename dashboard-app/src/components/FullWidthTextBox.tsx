import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ColoursEnum } from '../styles/design_system';
import { Paragraph } from './Typography';

type Prop = {
  text: string
  height?: string
};

const NoDataContainer = styled.div<Pick<Prop, 'height'>>`
  height: ${({ height = '10rem' }) => height};
  width: 100%;
  background-color: ${ColoursEnum.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FullWidthTextBox: FunctionComponent<Prop> = ({ height, text, ...rest }) => (
  <NoDataContainer height={height} {...rest}>
    <Paragraph>{text}</Paragraph>
  </NoDataContainer>
);
