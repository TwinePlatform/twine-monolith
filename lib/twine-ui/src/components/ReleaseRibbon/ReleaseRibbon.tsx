import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import { RibbonPosition } from './types';
import { getRibbonPosition } from './position';


type ReleaseRibbonProps = {
  fixed: boolean
  position: RibbonPosition
  text: string
};


const Container = styled.div<ReleaseRibbonProps>`
  position: ${(props) => props.fixed ? "fixed" : "absolute"};
  width: 200px;
  background: #e43;
  top: 25px;
  left: -50px;
  text-align: center;
  line-height: 50px;
  letter-spacing: 1px;
  color: #f0f0f0;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  ${(props) => getRibbonPosition(props.position)}
`;


const ReleaseRibbon: FunctionComponent<ReleaseRibbonProps> = (props) => (
  <Container {...props}>
    {props.text}
  </Container>
);

export default ReleaseRibbon;
