import React, { FC } from 'react';
import styled from 'styled-components/native'

import { Heading } from '../../../lib/ui/typography';
/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

/*
 * Component
 */
const Settings: FC<Props> = () => {

  return (
    <View>
      <Heading>Settings</Heading>
      
    </View>
  );
}

export default Settings;
