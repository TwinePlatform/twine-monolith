import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors, fonts } from '../../../shared/style_guide';


const Left = styled.button`
  font-size: ${fonts.size.base};
  padding: 0.7rem;
  outline: none;
  border: 0.1em solid ${colors.light};
  border-right: none;
  border-top-left-radius: 0.3125rem;
  border-bottom-left-radius: 0.3125rem;
  background-color: ${props => props.active ? colors.highlight_primary : colors.white};
  color: ${colors.dark};
  cursor: pointer;
`;

const Right = styled.button`
  font-size: ${fonts.size.base};
  padding: 0.7rem;
  outline: none;
  border: 0.1em solid ${colors.light};
  border-left: none;
  border-top-right-radius: 0.3125rem;
  border-bottom-right-radius: 0.3125rem;
  background-color: ${props => props.active ? colors.highlight_primary : colors.white};
  color: ${colors.dark};
  cursor: pointer;
`;

const Container = styled.div``;

const Toggle = (props) => {
  const { left, right, leftTitle, rightTitle, onChange } = props;
  const [active, setActive] = useState(props.active || left);

  const onClick = useCallback((side) => {
    setActive(side);
    onChange(side === left ? left : right);
  }, [left, onChange, right]);

  return (
    <Container>
      <Left active={active === left} onClick={() => onClick(left, 'left')} title={leftTitle}>
        {left}
      </Left>
      <Right active={active === right} onClick={() => onClick(right, 'right')} title={rightTitle}>
        {right}
      </Right>
    </Container>
  );
};

Toggle.propTypes = {
  active: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  right: PropTypes.string.isRequired,
  leftTitle: PropTypes.string,
  rightTitle: PropTypes.string,
  onChange: PropTypes.func,
};

Toggle.defaultProps = {
  leftTitle: '',
  rightTitle: '',
  onChange: () => {},
};

export default Toggle;
