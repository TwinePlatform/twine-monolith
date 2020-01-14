import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import styled from 'styled-components/native';
import { NavigationInjectedProps } from 'react-navigation';
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
import { ButtonType } from '../../../lib/ui/CardWithButtons/types';

/*
 * Types
 */
type PropsProjectTab = {
  projects: any[];
  onConfirmDispatch: (id: number) => (dispatch: any) => Promise<void>;
  confirmationText: string;
  buttonType: ButtonType;
}

type Props = {}

/*
 * Styles
 */
const View = styled.View`
  alignItems: 
center;
`;

/*
 * Components
 */
const ProjectTab: FC<PropsProjectTab> = ({
  projects, onConfirmDispatch, confirmationText, buttonType,
}) => {
  const dispatch = useDispatch();
  const [archiveModalVisible, toggleArchiveModal] = useToggle(false);

  const [activeCardId, setActiveCardId] = useState();

  const onPress = (id: number) => {
    setActiveCardId(id);
    toggleArchiveModal();
  };

  const onConfirm = () => {
    dispatch(onConfirmDispatch(activeCardId));
    toggleArchiveModal();
  };

  return (
    <View>
      <ConfirmationModal
        isVisible={archiveModalVisible}
        onCancel={toggleArchiveModal}
        onConfirm={onConfirm}
        title="Archive"
        text={confirmationText}
      />

      { projects && projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.name}
          date={formatDate(project.createdAt)}
          buttonType={buttonType}
          onPress={() => onPress(project.id)}
        />
      ))}
    </View>
  );
};


const Projects: FC<Props & NavigationInjectedProps> = ({ navigation }) => {
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadProjects());
  }, []);


  const projects = useSelector(selectOrderedProjects, shallowEqual);
  const projectsRequestStatus = useSelector(selectProjectsStatus, shallowEqual);
  return (
    <Page heading="Projects" withAddBar>
      <AddBar onPress={() => navigation.navigate('AdminAddProject')} title="Add Project" />
      <Loader isVisible={projectsRequestStatus.isFetching} />

      <Tabs
        tabOne={['Active', ProjectTab, {
          projects: projects.filter(({ deletedAt }) => !deletedAt),
          onConfirmDispatch: deleteProject,
          confirmationText: 'Are you sure you want to archive this project?',
          buttonType: 'archive',
        }]}
        tabTwo={['Archived', ProjectTab, {
          projects: projects.filter(({ deletedAt }) => deletedAt),
          onConfirmDispatch: restoreProject,
          confirmationText: 'Are you sure you want to restore this project?',
          buttonType: 'restore',
        }]}
      />
    </Page>
  );
};

export default Projects;
