import React from 'react';
import styled from 'styled-components';
import { SpacingEnum } from '../design_system';


type CardProps = {
  padded?: boolean
};

const Container = styled.div`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: ${(props: CardProps) => props.padded ? SpacingEnum.small : '0'};
`;


const Card: React.FunctionComponent<CardProps> = (props) => (
  <Container {...props}>
    {props.children}
  </Container>
);

export default Card;
