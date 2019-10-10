import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../../lib/ui/typography';
import VolunteerCard from './VolunteerCard';

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


const Volunteers: FC<Props> = () => (
  <Page>
    <View>
      <Heading>Volunteers</Heading>
      <VolunteerCard id={1} title="Kara Thrace" date="11/11/18" />
      <VolunteerCard id={1} title="Lee Adama" date="11/11/18" />
      <VolunteerCard id={1} title="Hera Agathon" date="11/11/18" />
      <VolunteerCard id={1} title="Tory Foster" date="11/11/18" />
      <VolunteerCard id={1} title="Ellen Tigh" date="11/11/18" />
    </View>
  </Page>
);

export default Volunteers;
