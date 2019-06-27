import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { TabList } from './TabList';
import { Tab } from './Tab';


/**
 * Types
 */
type TabProps = {
  titles: string[]
  initialActiveTab?: number
};

/**
 * Styles
 */
const TabContainer = styled.div`
`;

export const TabGroup: React.FunctionComponent<TabProps> = (props) => {
  const { initialActiveTab = 0 } = props;
  const [activeTab, setActiveTab] = useState(initialActiveTab);

  const onClickTab = useCallback(setActiveTab, []);

  const children = React.Children.map(props.children, (child, idx) => (
    idx === activeTab
      ? (
        <Tab isActive idx={idx}>
          {child}
        </Tab>
      )
      : null
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
