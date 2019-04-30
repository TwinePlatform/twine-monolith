import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ColoursEnum, Fonts, SpacingEnum } from '../styles/style_guide';

type Side = 'left' | 'right';

type ToggleProps = {
  left: string
  right: string
  leftTitle?: string
  rightTitle?: string
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
  const {
    left,
    right,
    leftTitle,
    rightTitle,
    onChange,
  } = props;
  const [active, setActive] = useState<Side>('left');

  const onClick = useCallback((side: Side) => {
    setActive(side);
    onChange(side === 'left' ? left : right);
  }, [active]);

  return (
    <Container>
      <Left active={active === 'left'} onClick={() => onClick('left')} title={leftTitle}>
        {left}
      </Left>
      <Right active={active === 'right'} onClick={() => onClick('right')} title={rightTitle}>
        {right}
      </Right>
    </Container>
  );
};

export default Toggle;
