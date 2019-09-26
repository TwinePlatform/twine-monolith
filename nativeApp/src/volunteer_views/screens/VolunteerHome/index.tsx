import React from 'react';
import styled from 'styled-components/native'

import { Heading } from '../../../lib/ui/typography';

const View = styled.View`
  alignItems: center;
`;

export default function VolunteerHome(props) {

  return (
    <View>
      <Heading>Your Time</Heading>
    </View>
  );
}
