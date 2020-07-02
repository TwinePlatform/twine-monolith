import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


/**
 * Styles
 */
const TabContainer = styled.div`
  display: ${props => props.isActive ? 'inherit' : 'none'};
`;


const Tab = ({ children, ...rest }) => (
  <TabContainer {...rest}>
    {children}
  </TabContainer>
);

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  idx: PropTypes.number.isRequired,
};

Tab.defaultProps = {
  isActive: false,
};

export default Tab;
