import React, { FC } from 'react';
import styled from 'styled-components/native';

import { Heading } from '../../../lib/ui/typography';
import TimeCard from '../../../lib/ui/TimeCard';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Page = styled.ScrollView`
`;

const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

/*
 * Component
 */
const AdminTime: FC<Props> = () => (
  <Page>
    <View>
      <Heading>Volunteers Time</Heading>
      <TimeCard id={1} volunteer="Kara Thrace" timeValues={[2, 9]} labels={['General', 'Office Work']} date="30/04/19" />
      <TimeCard id={1} volunteer="Lee Adama" timeValues={[7, 19]} labels={['General', 'Office Work']} date="03/06/19" />
      <TimeCard id={1} volunteer="Kara Thrace" timeValues={[0, 49]} labels={['General', 'Office Work']} date="15/07/19" />
      <TimeCard id={1} volunteer="Gais Baltar" timeValues={[2, 12]} labels={['General', 'Office Work']} date="30/08/19" />
      <TimeCard id={1} volunteer="Kara Thrace" timeValues={[2, 18]} labels={['General', 'Office Work']} date="30/09/19" />
    </View>
  </Page>

);

export default AdminTime;
