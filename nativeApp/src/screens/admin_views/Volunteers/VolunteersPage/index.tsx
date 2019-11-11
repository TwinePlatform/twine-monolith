import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import moment from 'moment';

import { ColorDotsLoader } from 'react-native-indicator';

import { NavigationFocusInjectedProps } from 'react-navigation';
import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';
import useToggle from '../../../../lib/hooks/useToggle';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import useRequest from '../../../../lib/hooks/requestHook';
import { CommunityBusinesses } from '../../../../api';
import { ColoursEnum } from '../../../../lib/ui/colours';
import { Status } from '../../../types';
import { loadVolunteers, selectOrderedVolunteers, selectVolunteersStatus } from '../../../../redux/volunteers';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

/*
 * Component
 */
const Volunteers: FC<NavigationFocusInjectedProps & Props> = ({ navigation }) => {
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadVolunteers());
  }, []);

  const volunteers = useSelector(selectOrderedVolunteers, shallowEqual);
  const volunteersRequestStatus = useSelector(selectVolunteersStatus, shallowEqual);

  // React State
  const [deleteModalVisibility, toggleDeleteModalVisibility] = useToggle(false);
  const [activeCard, setActiveCard] = useState(null);

  // Handlers
  const onDelete = (id: number) => {
    toggleDeleteModalVisibility();
    setActiveCard(id);
  };

  const onConfirm = () => {
    /*
    * TODO:
    * - dispatch redux action deleteVolunteerAndUpdate(activeCard.id)
    * - hide modal
    * - display some type of loader whilst waiting
    */
  };

  // TODO: error handling
  return (
    <Page heading="Volunteers" withAddBar>
      <AddBar title="Add Volunteer" onPress={() => navigation.navigate('AdminAddVolunteer')} />
      {/* TODO: look into Portals for potential modal replacement */}
      <ConfirmationModal
        isVisible={deleteModalVisibility}
        title="Delete"
        text="Are you sure you want to delete this volunteer?"
        onCancel={toggleDeleteModalVisibility}
        onConfirm={onConfirm}
      />

      {volunteersRequestStatus.isFetching && (
      <ColorDotsLoader
        color1={ColoursEnum.purple}
        color2={ColoursEnum.mustard}
        color3={ColoursEnum.grey}
        size={20}
      />
      )}
      {/* TODO: create function for loading logic */}
      { !volunteersRequestStatus.isFetching
        && !volunteersRequestStatus.error
        && volunteers.map((volunteer) => (
          <VolunteerCard
            key={volunteer.id}
            id={volunteer.id}
            title={volunteer.name}
            date={moment(volunteer.createdAt).format('DD/MM/YY')}
            onDelete={() => onDelete(volunteer.id)}
            volunteerData={volunteer}
          />
        ))}
    </Page>
  );
};

export default Volunteers;
