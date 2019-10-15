import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../../lib/ui/typography';
import Tabs from '../../../lib/ui/Tabs';
import ProjectCard from './ProjectCard';
import Page from '../../../lib/ui/Page';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
  alignItems: center;
`;

const TabOne: FC<{}> = () => (
  <View>
    <ProjectCard id={1} title="Summer Fair" date="30/12/18" removalType="archive" />
  </View>
);

const TabTwo: FC<{}> = () => (
  <View>
    <ProjectCard id={1} title="Christmas Fair" date="11/11/18" removalType="restore" />
  </View>
);

/*
 * Component
 */
const Projects: FC<Props> = () => (
  <Page>
    <Heading>Projects</Heading>
    <Tabs
      tabOne={['Active', TabOne]}
      tabTwo={['Archived', TabTwo]}
    />
  </Page>
);

export default Projects;
