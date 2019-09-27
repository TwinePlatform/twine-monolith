import React from 'react';
import styled from 'styled-components/native'

import { Heading } from '../../../lib/ui/typography';

const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

export default function Time(props) {

  return (
    <View>
      <Heading>Time</Heading>
      
    </View>
  );
}
