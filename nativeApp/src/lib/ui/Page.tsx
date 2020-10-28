import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading as H } from './typography';

/*
 * Types
 */
type Props = {
  heading: string;
  withAddBar?: boolean;
}

/*
 * Styles
 */
const Scrollable = styled.ScrollView`
`;

const Heading = styled(H)<{withAddBar: boolean}>`
  marginBottom: ${({ withAddBar }) => (withAddBar ? '10' : '20')}
`;

const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

/*
 * Component
 */
const Page: FC<Props> = ({ heading, children, withAddBar }) => (
  <Scrollable
    keyboardShouldPersistTaps={'handled'}
  >
    <View>
      <Heading withAddBar={withAddBar}>{heading}</Heading>
      {children}
    </View>
  </Scrollable>
);

export default Page;
