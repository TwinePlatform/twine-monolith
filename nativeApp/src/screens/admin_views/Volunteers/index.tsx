import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../../lib/ui/typography';
import Card from '../../../lib/ui/CardWithTitleAndDate';

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
      <Card id={1} title="Kara Thrace" datePrefix="Joined" date="11/11/18" removeType="delete" />
      <Card id={1} title="Lee Adama" datePrefix="Joined" date="11/11/18" removeType="delete" />
      <Card id={1} title="Hera Agathon" datePrefix="Joined" date="11/11/18" removeType="delete" />
      <Card id={1} title="Tory Foster" datePrefix="Joined" date="11/11/18" removeType="delete" />
      <Card id={1} title="Ellen Tigh" datePrefix="Joined" date="11/11/18" removeType="delete" />
    </View>
  </Page>
);

export default Volunteers;
