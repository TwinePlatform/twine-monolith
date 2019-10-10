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
  const { children, removalType } = props;
  return (
    <Card>
      <TopContainer>
        {children}
      </TopContainer>
      {removalType === 'archive' && <ArchiveButton />}
      {removalType === 'delete' && <DeleteButton />}
      {removalType === 'restore' && <RestoreButton />}
    </Card>

  );
};

export default CardWithButtons;
