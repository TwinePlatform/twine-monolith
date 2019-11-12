import React, { FC, useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NavigationFocusInjectedProps } from 'react-navigation';
import moment from 'moment';

import {
  loadVolunteers,
  selectOrderedVolunteers,
  selectVolunteersStatus,
} from '../../../../redux/entities/volunteers';
import useToggle from '../../../../lib/hooks/useToggle';
import { User } from '../../../../../../api/src/models';

import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import Loader from '../../../../lib/ui/Loader';

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
  const onEdit = (volunteer: User) => {
    navigation.navigate('AdminEditVolunteer', volunteer);
  };

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
    console.log(activeCard);
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

      <Loader isVisible={volunteersRequestStatus.isFetching} />
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
            onEdit={() => onEdit(volunteer)}
          />
        ))}
    </Page>
  );
};

export default Volunteers;
