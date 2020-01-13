import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import styled from 'styled-components/native';
import Tabs from '../../../lib/ui/Tabs';
import ProjectCard from './ProjectCard';
import Page from '../../../lib/ui/Page';
import AddBar from '../../../lib/ui/AddBar';
import ConfirmationModal from '../../../lib/ui/modals/ConfirmationModal';
import useToggle from '../../../lib/hooks/useToggle';
import {
  loadProjects,
  deleteProject,
  restoreProject,
  selectOrderedProjects,
  selectProjectsStatus,
} from '../../../redux/entities/projects';
import Loader from '../../../lib/ui/Loader';
import { formatDate } from '../../../lib/utils/time';

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

const ActiveTab: FC<{}> = ({ projects }) => {
  const dispatch = useDispatch();
  const [archiveModalVisible, toggleArchiveModal] = useToggle(false);

  const [activeCardId, setActiveCardId] = useState();

  const onArchive = (id: number) => {
    setActiveCardId(id);
    toggleArchiveModal();
  };
  const onConfirm = () => {
    dispatch(deleteProject(activeCardId));
    toggleArchiveModal();
  };

  return (
    <View>
      <ConfirmationModal
        isVisible={archiveModalVisible}
        onCancel={toggleArchiveModal}
        onConfirm={onConfirm}
        title="Archive"
        text="Are you sure you want to archive this project?"
      />


      { projects && projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.name}
          date={formatDate(project.createdAt)}
          buttonType="archive"
          onArchive={() => onArchive(project.id)}
        />
      ))}


    </View>
  );
};
// TODO: refactor tab componenents are the same
const ArchivedTab: FC<{}> = ({ projects }) => {
  const dispatch = useDispatch();
  const [restoreModalVisible, toggleRestoreModal] = useToggle(false);

  const [activeCardId, setActiveCardId] = useState();


  const onRestore = (id: number) => {
    setActiveCardId(id);
    toggleRestoreModal();
  };
  const onConfirm = () => {
    dispatch(restoreProject(activeCardId));
    toggleRestoreModal();
  };

  return (
    <View>
      <ConfirmationModal
        isVisible={restoreModalVisible}
        onCancel={toggleRestoreModal}
        onConfirm={onConfirm}
        title="Restore"
        text="Are you sure you want to restore this project?"
      />

      { projects && projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.name}
          date={formatDate(project.createdAt)}
          deletedDate={formatDate(project.deletedAt)}
          buttonType="restore"
          onRestore={() => onRestore(project.id)}
        />
      ))}
    </View>
  );
};

/*
 * Component
 */
const Projects: FC<Props> = () => {
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProjects());
  }, []);


  const projects = useSelector(selectOrderedProjects, shallowEqual);
  const projectsRequestStatus = useSelector(selectProjectsStatus, shallowEqual);
  return (
    <Page heading="Projects" withAddBar>
      <AddBar onPress={() => {}} title="Add Project" />
      <Loader isVisible={projectsRequestStatus.isFetching} />

      <Tabs
        tabOne={['Active', ActiveTab, { projects: projects.filter(({ deletedAt }) => !deletedAt) }]}
        tabTwo={['Archived', ArchivedTab, { projects: projects.filter(({ deletedAt }) => deletedAt) }]}
      />
    </Page>
  );
};

export default Projects;
