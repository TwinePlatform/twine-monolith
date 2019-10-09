import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Card as C, Button as B } from 'native-base';

import { ColoursEnum } from './colours';

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

const ArchiveButton: FC = () => (
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

const DeleteButton: FC = () => (
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

const UndoButton: FC = () => (
  <ButtonContainer>
    <Button transparent>
      {/* <BorderRight>
        <MaterialCommunityIcons name="square-edit-outline" outline size={20} color={ColoursEnum.purple} />
        <LinkText>Edit</LinkText>
      </BorderRight> */}
    </Button>
    <Button transparent>
      <MaterialCommunityIcons name="undo" outline size={20} color={ColoursEnum.purple} />
      <LinkText>Unarchive</LinkText>
    </Button>
  </ButtonContainer>
);
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
