import React from 'react';
import styled from 'styled-components';
import { PaddingEnum } from './styles'

type CardProps = {
  padded?: boolean
};

const Container = styled.div`
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  padding: ${(props: CardProps) => props.padded ? PaddingEnum.small : '0'};
`;


const Card: React.FunctionComponent<CardProps> = (props) => (
  <Container {...props}>
    {props.children}
  </Container>
);

export default Card;
