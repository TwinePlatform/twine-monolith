import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button as B } from 'native-base';

import { ColoursEnum } from '../colours';
import {
  ButtonConfig, ArchiveButtonConfig, DeleteButtonConfig, RestoreButtonConfig, SaveButtonConfig,
} from './types';

/*
 * Types
 */

type Props<T extends ButtonConfig> = {
  buttonConfig: T;
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
  color: ${ColoursEnum.darkPurple};
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
export const ArchiveButton: FC<Props<ArchiveButtonConfig>> = ({ buttonConfig: { onArchive, onEdit } }) => (
  <ButtonContainer>
    <Button transparent onPress={onEdit}>
      <BorderRight>
        <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.darkPurple} />
        <LinkText>Edit</LinkText>
      </BorderRight>
    </Button>
    <Button transparent onPress={onArchive}>
      <MaterialIcons name="archive" outline size={20} color={ColoursEnum.darkPurple} />
      <LinkText>Archive</LinkText>
    </Button>
  </ButtonContainer>
);

export const DeleteButton: FC<Props<DeleteButtonConfig>> = ({ buttonConfig: { onDelete, onEdit } }) => ( //eslint-disable-line
  <ButtonContainer>
    <Button transparent onPress={onEdit}>
      <BorderRight>
        <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.darkPurple} />
        <LinkText>Edit</LinkText>
      </BorderRight>
    </Button>
    <Button transparent onPress={onDelete}>
      <MaterialCommunityIcons name="trash-can-outline" outline size={20} color={ColoursEnum.darkPurple} />
      <LinkText>Delete</LinkText>
    </Button>
  </ButtonContainer>
);

export const RestoreButton: FC<Props<RestoreButtonConfig>> = ({ buttonConfig: { onRestore } }) => (
  <ButtonContainer>
    <Button transparent />
    <Button transparent onPress={onRestore}>
      <MaterialCommunityIcons name="undo" outline size={20} color={ColoursEnum.darkPurple} />
      <LinkText>Restore</LinkText>
    </Button>
  </ButtonContainer>
);

export const SaveButton: FC<Props<SaveButtonConfig>> = ({ buttonConfig: { onSave } }) => (
  <ButtonContainer>
    <Button transparent />
    <Button transparent onPress={onSave}>
      <MaterialCommunityIcons name="content-save-outline" outline size={20} color={ColoursEnum.darkPurple} />
      <LinkText>Save</LinkText>
    </Button>
  </ButtonContainer>
);
