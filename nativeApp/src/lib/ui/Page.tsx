import React, { FC } from 'react';
import styled from 'styled-components/native';

/*
 * Types
 */
type Props = {
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
const Page: FC<Props> = ({ children }) => (
  <Scrollable>
    <View>
      {children}
    </View>
  </Scrollable>
);

export default Page;
