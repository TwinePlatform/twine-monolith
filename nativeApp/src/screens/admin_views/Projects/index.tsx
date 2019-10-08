import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../../lib/ui/typography';
import Tabs from '../../../lib/ui/Tabs';

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
const Projects: FC<Props> = () => (
  <Page>
    <View>
      <Heading>Projects</Heading>
      <Tabs
        tabOne={['Active', View]}
        tabTwo={['Archived', View]}
      />
    </View>
  </Page>
);

export default Projects;
