import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ColoursEnum, Fonts } from '../../../lib/ui/design_system';

export type Side = 'left' | 'right';

type ToggleProps = {
  left: string
  right: string
  leftTitle?: string
  rightTitle?: string
  active?: Side
  onChange: (s: string) => void
};

const Left = styled.button<{ active: boolean }>`
  font-size: ${Fonts.size.body};
  padding: 0.7rem;
  outline: none;
  border: 1px solid ${ColoursEnum.darkGrey};
  border-top-left-radius: 0.3125rem;
  border-bottom-left-radius: 0.3125rem;
  background-color: ${(props) => props.active ? ColoursEnum.darkGrey : ColoursEnum.white};
  color: ${(props) => props.active ? ColoursEnum.white : ColoursEnum.black};
  cursor: pointer;
`;

const Right = styled.button<{ active: boolean }>`
  font-size: ${Fonts.size.body};
  padding: 0.7rem;
  outline: none;
  border: 1px solid ${ColoursEnum.darkGrey};
  border-top-right-radius: 0.3125rem;
  border-bottom-right-radius: 0.3125rem;
  background-color: ${(props) => props.active ? ColoursEnum.darkGrey : ColoursEnum.white};
  color: ${(props) => props.active ? ColoursEnum.white : ColoursEnum.black};
  cursor: pointer;
`;

const Container = styled.div``;


const Toggle: React.FunctionComponent<ToggleProps> = (props) => {
  const { left, right, leftTitle, rightTitle, onChange, ...rest } = props;
  const [active, setActive] = useState<Side>(props.active || 'left');

  const onClick = useCallback((side: Side) => {
    setActive(side);
    onChange(side === 'left' ? left : right);
  }, [left, onChange, right]);

  return (
    <Container {...rest}>
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
