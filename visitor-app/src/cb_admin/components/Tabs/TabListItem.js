import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { colors } from '../../../shared/style_guide';

/**
 * Styles
 */
const Item = styled.li`
  padding: 1rem 2rem;
  cursor: pointer;
  color: ${colors.dark};
  ${props => props.isActive ? `border-bottom: 4px solid ${colors.highlight_primary};` : ''}
`;


/**
 * Component
 */
const TabListItem = (props) => {
  const {
    title,
    isActive = false,
    onClick = () => {},
  } = props;

  return (
    <Item onClick={onClick} isActive={isActive}>
      {title}
    </Item>
  );
};

TabListItem.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

TabListItem.defaultProps = {
  isActive: false,
  onClick: () => {},
};

export default TabListItem;
