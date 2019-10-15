import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from './typography';

/*
 * Types
 */
type Props = {
  heading: string;
}

/*
 * Styles
 */
const Scrollable = styled.ScrollView`
`;

const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

/*
 * Component
 */
const Page: FC<Props> = ({ heading, children }) => (
  <Scrollable>
    <View>
      <Heading>{heading}</Heading>
      {children}
    </View>
  </Scrollable>
);

export default Page;
