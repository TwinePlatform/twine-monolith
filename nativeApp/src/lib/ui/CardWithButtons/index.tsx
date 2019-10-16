import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Card as C } from 'native-base';

import { ColoursEnum } from '../colours';
import { ArchiveButton, DeleteButton, RestoreButton } from './Buttons';

/*
 * Types
 */

export type RemovalType = 'archive' | 'delete' | 'restore';
type Props = {
  removalType: RemovalType;
  onPressOne: () => void;
  onPressTwo: () => void;
}

/*
 * Styles
 */
const Card = styled(C)`
  width: 85%;
  marginBottom: 10;
`;

const TopContainer = styled.View`
  marginLeft: 10;
  marginTop: 10;
  marginRight: 10;
  paddingBottom: 5;
  borderBottomWidth: 1;
  borderColor: ${ColoursEnum.grey};
`;

/*
 * Component
 */
const CardWithButtons: FC<Props> = (props) => {
  const {
    children, removalType, onPressOne, onPressTwo,
  } = props;
  return (
    <Card>
      <TopContainer>
        {children}
      </TopContainer>
      {removalType === 'archive' && <ArchiveButton onPressOne={onPressOne} onPressTwo={onPressTwo} />}
      {removalType === 'delete' && <DeleteButton onPressOne={onPressOne} onPressTwo={onPressTwo} />}
      {removalType === 'restore' && <RestoreButton onPressOne={onPressOne} />}
    </Card>

  );
};

export default CardWithButtons;
