import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Card as C } from 'native-base';

import { ColoursEnum } from '../colours';
import { ArchiveButton, DeleteButton, UndoButton } from './Buttons';

/*
 * Types
 */

export type RemoveType = 'archive' | 'delete' | 'undo';
type Props = {
  removeType: RemoveType;
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
  const { children, removeType } = props;
  return (
    <Card>
      <TopContainer>
        {children}
      </TopContainer>
      {removeType === 'archive' && <ArchiveButton />}
      {removeType === 'delete' && <DeleteButton />}
      {removeType === 'undo' && <UndoButton />}
    </Card>

  );
};

export default CardWithButtons;
