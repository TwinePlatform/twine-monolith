import React from 'react';
import styled from 'styled-components';
import { ColoursEnum } from '../../styles/design_system';


/**
 * Types
 */
type TabListItemProps = {
  title: string
  isActive?: boolean
  onClick: (a: any) => void
};


/**
 * Styles
 */
const Item = styled.li`
  padding: 1rem;
  cursor: pointer;
  ${
    (props: Pick<TabListItemProps, 'isActive'>) => props.isActive
      ? `border-bottom: 4px solid ${ColoursEnum.darkGrey};`
      : ''
  }
`;


/**
 * Component
 */
export const TabListItem: React.FunctionComponent<TabListItemProps> = (props) => {
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
