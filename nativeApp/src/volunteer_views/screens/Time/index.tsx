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
const Time: FC<Props> = () => {

  return (
    <View>
      <Heading>Time</Heading>
    </View>
  );
}

export default Time;
