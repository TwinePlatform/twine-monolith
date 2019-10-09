import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../../lib/ui/typography';
import Tabs from '../../../lib/ui/Tabs';
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

const TabOne: FC<{}> = () => (
  <View>
    <Card id={1} title="Summer Fair" datePrefix="Created" date="30/12/18" removeType="archive" />
  </View>
);

const TabTwo: FC<{}> = () => (
  <View>
    <Card id={1} title="Christmas Fair" datePrefix="Created" date="11/11/18" removeType="undo" />
  </View>
);

/*
 * Component
 */
const Projects: FC<Props> = () => (
  <Page>
    <View>
      <Heading>Projects</Heading>
      <Tabs
        tabOne={['Active', TabOne]}
        tabTwo={['Archived', TabTwo]}
      />
    </View>
  </Page>
);

export default Projects;
