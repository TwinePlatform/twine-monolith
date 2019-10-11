import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button as B } from 'native-base';

import { ColoursEnum } from '../colours';

/*
 * Types
 */

type Props = {
}

/*
 * Styles
 */
const ButtonContainer = styled.View`
  flexDirection: row;
`;
const Button = styled(B)`
  borderRadius: 0;
  flex: 1;
  flexDirection: row;
  alignItems: center;
  justifyContent: center;
`;
const LinkText = styled.Text`
  marginLeft: 2;
  textAlign: center;
  color: ${ColoursEnum.purple};
  fontSize: 15;
`;

const BorderRight = styled.View`
  flex: 1;
  borderRightWidth: 1;
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  borderColor: ${ColoursEnum.grey};
`;

/*
 * Components
 */
export const ArchiveButton: FC = () => (
  <ButtonContainer>
    <Button transparent>
      <BorderRight>
        <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.purple} />
        <LinkText>Edit</LinkText>
      </BorderRight>
    </Button>
    <Button transparent>
      <MaterialIcons name="archive" outline size={20} color={ColoursEnum.purple} />
      <LinkText>Archive</LinkText>
    </Button>
  </ButtonContainer>
);

export const DeleteButton: FC = () => (
  <ButtonContainer>
    <Button transparent>
      <BorderRight>
        <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.purple} />
        <LinkText>Edit</LinkText>
      </BorderRight>
    </Button>
    <Button transparent>
      <MaterialCommunityIcons name="trash-can-outline" outline size={20} color={ColoursEnum.purple} />
      <LinkText>Delete</LinkText>
    </Button>
  </ButtonContainer>
);

export const RestoreButton: FC = () => (
  <ButtonContainer>
    <Button transparent />
    <Button transparent>
      <MaterialCommunityIcons name="undo" outline size={20} color={ColoursEnum.purple} />
      <LinkText>Restore</LinkText>
    </Button>
  </ButtonContainer>
);