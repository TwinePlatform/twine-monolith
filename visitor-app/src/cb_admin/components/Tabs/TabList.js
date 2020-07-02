import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';
import TabListItem from './TabListItem';
import { colors } from '../../../shared/style_guide';


/**
 * Styles
 */
const List = styled.ol`
  margin-bottom: 4rem;
  list-style: none;
  display: flex;
  border-bottom: 1px solid ${rgba(colors.dark, 0.5)};
`;

const TabList = (props) => {
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

TabList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.number.isRequired,
  onClickTab: PropTypes.func,
};

TabList.defaultProps = {
  onClickTab: () => {},
};

export default TabList;
