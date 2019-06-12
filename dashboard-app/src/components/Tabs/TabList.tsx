import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { TabListItem } from './TabListItem';
import { ColoursEnum } from '../../styles/design_system';


/**
 * Types
 */
type TabListProps = {
  items: string[]
  activeTab: number
  onClickTab?: (n: number) => void
};


/**
 * Styles
 */
const List = styled.ol`
  margin-bottom: 4rem;
  list-style: none;
  display: flex;
  border-bottom: 1px solid ${rgba(ColoursEnum.grey, 0.4)};
`;

export const TabList: React.FunctionComponent<TabListProps> = (props) => {
  const {
    items,
    activeTab,
    onClickTab = () => {},
  } = props;

  return (
    <List>
      {
        items.map((item, idx) => (
          <TabListItem
            title={item}
            isActive={idx === activeTab}
            onClick={() => onClickTab(idx)}
            key={item}
          />
        ))
      }
    </List>
  );
};
