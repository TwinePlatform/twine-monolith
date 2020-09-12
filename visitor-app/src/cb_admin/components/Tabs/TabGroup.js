import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TabList from './TabList';
import Tab from './Tab';


/**
 * Styles
 */
const TabContainer = styled.div`
`;

const TabGroup = (props) => {
  const { initialActiveTab = 0 } = props;
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const onClickTab = useCallback(setActiveTab, []);

  const children = React.Children.map(props.children, (child, idx) => (
    <Tab isActive={idx === activeTab} idx={idx}>
      {child}
    </Tab>
  ));

  return (
    <TabContainer>
      <TabList
        items={props.titles}
        activeTab={activeTab}
        onClickTab={onClickTab}
      />
      {children}
    </TabContainer>
  );
};

TabGroup.propTypes = {
  initialActiveTab: PropTypes.number,
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

TabGroup.defaultProps = {
  initialActiveTab: 0,
};

export default TabGroup;
