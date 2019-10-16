import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Card as C } from 'native-base';

import { ColoursEnum } from '../colours';
import {
  ArchiveButton, DeleteButton, RestoreButton, SaveButton,
} from './Buttons';

/*
 * Types
 */

export type ButtonType = 'archive' | 'delete' | 'restore' | 'save';
type Props = {
  buttonType: ButtonType;
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
    children, buttonType, onPressOne, onPressTwo,
  } = props;
  return (
    <Card>
      <TopContainer>
        {children}
      </TopContainer>
      {buttonType === 'archive' && <ArchiveButton onPressOne={onPressOne} onPressTwo={onPressTwo} />}
      {buttonType === 'delete' && <DeleteButton onPressOne={onPressOne} onPressTwo={onPressTwo} />}
      {buttonType === 'restore' && <RestoreButton onPressOne={onPressOne} />}
      {buttonType === 'save' && <SaveButton onPressOne={onPressOne} />}
    </Card>

  );
};

export default CardWithButtons;
