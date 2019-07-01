import React from 'react';
import styled from 'styled-components';


/**
 * Types
 */
type TabProps = {
  isActive?: boolean
  idx: number
};

/**
 * Styles
 */
const TabContainer = styled.div`
  display: ${(props: TabProps) => props.isActive ? 'inherit' : 'none'};
`;


export const Tab: React.FunctionComponent<TabProps> = (props) => {
  const { children, ...rest } = props;
  return (
    <TabContainer {...rest}>
      {children}
    </TabContainer>
  );
};
