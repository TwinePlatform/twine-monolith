import React, { FC } from 'react';
import styled from 'styled-components/native';
import Tabs from '../../../lib/ui/Tabs';
import ProjectCard from './ProjectCard';
import Page from '../../../lib/ui/Page';
import AddBar from '../../../lib/ui/AddBar';
import ConfirmationModal from '../../../lib/ui/modals/ConfirmationModal';
import useToggle from '../../../lib/hooks/useToggle';

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

const ActiveTab: FC<{}> = () => {
  const [archiveModalVisible, toggleArchiveModal] = useToggle(false);

  return (
    <View>
      <ConfirmationModal
        isVisible={archiveModalVisible}
        onCancel={toggleArchiveModal}
        onConfirm={toggleArchiveModal}
        title="Archive"
        text="Are you sure you want to archive this project?"
      />

      <ProjectCard
        id={1}
        title="Summer Fair"
        date="30/12/18"
        buttonType="archive"
        onArchive={toggleArchiveModal}
      />
    </View>
  );
};

const ArchivedTab: FC<{}> = () => {
  const [restoreModalVisible, toggleRestoreModal] = useToggle(false);
  return (
    <View>
      <ConfirmationModal
        isVisible={restoreModalVisible}
        onCancel={toggleRestoreModal}
        onConfirm={toggleRestoreModal}
        title="Restore"
        text="Are you sure you want to restore this project?"
      />
      <ProjectCard
        id={1}
        title="Christmas Fair"
        date="11/11/18"
        buttonType="restore"
        onRestore={toggleRestoreModal}
      />
    </View>
  );
};

/*
 * Component
 */
const Projects: FC<Props> = () => (
  <Page heading="Projects" withAddBar>
    <AddBar onPress={() => {}} title="Add Project" />
    <Tabs
      tabOne={['Active', ActiveTab]}
      tabTwo={['Archived', ArchivedTab]}
    />
  </Page>
);

export default Projects;
