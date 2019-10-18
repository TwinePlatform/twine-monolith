import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Card as C } from 'native-base';

import { ColoursEnum } from '../colours';
import {
  ArchiveButton, DeleteButton, RestoreButton, SaveButton,
} from './Buttons';
import { ButtonConfig } from './types';

/*
 * Types
 */
type Props = {
  buttonConfig: ButtonConfig;
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
    children, buttonConfig,
  } = props;
  return (
    <Card>
      <TopContainer>
        {children}
      </TopContainer>
      {buttonConfig.buttonType === 'archive' && <ArchiveButton buttonConfig={buttonConfig} />}
      {buttonConfig.buttonType === 'delete' && <DeleteButton buttonConfig={buttonConfig} />}
      {buttonConfig.buttonType === 'restore' && <RestoreButton buttonConfig={buttonConfig} />}
      {buttonConfig.buttonType === 'save' && <SaveButton buttonConfig={buttonConfig} />}
    </Card>

  );
};

export default CardWithButtons;
