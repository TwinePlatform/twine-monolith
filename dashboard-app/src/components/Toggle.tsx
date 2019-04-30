import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ColoursEnum, Fonts, SpacingEnum } from '../styles/style_guide';

type Side = 'left' | 'right';

type ToggleProps = {
  left: string
  right: string
  onChange: (s: string) => void
};

const Left = styled.button<{ active: boolean }>`
  font-size: ${Fonts.size.small};
  outline: none;
  border: 0.05rem solid ${ColoursEnum.light};
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  background-color: ${(props) => props.active ? ColoursEnum.light : ColoursEnum.offWhite};
  padding: ${SpacingEnum.small};
`;

const Right = styled.button<{ active: boolean }>`
  font-size: ${Fonts.size.small};
  outline: none;
  border: 0.05rem solid ${ColoursEnum.light};
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  background-color: ${(props) => props.active ? ColoursEnum.light : ColoursEnum.offWhite};
  padding: ${SpacingEnum.small};
`;

const Container = styled.div``;


const Toggle: React.FunctionComponent<ToggleProps> = (props) => {
  const [active, setActive] = useState<Side>('left');

  const onClick = useCallback((side: Side) => {
    setActive(side);
    props.onChange(side === 'left' ? props.left : props.right);
  }, [active]);

  return (
    <Container>
      <Left active={active === 'left'} onClick={() => onClick('left')}>{props.left}</Left>
      <Right active={active === 'right'} onClick={() => onClick('right')}>{props.right}</Right>
    </Container>
  );
};

export default Toggle;
