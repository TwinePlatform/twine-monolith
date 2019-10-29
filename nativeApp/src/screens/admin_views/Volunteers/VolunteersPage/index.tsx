import React, { FC, useState } from 'react';
import moment from 'moment';
import uuid from 'uuid/v4';

import { NavigationFocusInjectedProps } from 'react-navigation';
import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';
import useToggle from '../../../../lib/hooks/useToggle';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import useRequest from '../../../../lib/hooks/requestHook';
import { CommunityBusinesses } from '../../../../lib/api';

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
  const [deleteModalVisibility, toggleDeleteModalVisibility] = useToggle(false);
  const [activeCard, setActiveCard] = useState(null);
  const [reload, setReload] = useState((navigation.state.params || {}).reload);

  const [volunteers] = useRequest(CommunityBusinesses.getVolunteers, {}, [reload]);

  const onDelete = (id: number) => {
    toggleDeleteModalVisibility();
    setActiveCard(id);
  };

  const onConfirm = () => {
    CommunityBusinesses.deleteVolunteer(activeCard)
      .then(() => {
        setReload(uuid());
        toggleDeleteModalVisibility();
      })
      .catch(console.log); // TODO: error handling
  };

  // TODO loading spinner
  // TODO error handling
  return (
    <Page heading="Volunteers" withAddBar>
      <AddBar title="Add Volunteer" onPress={() => navigation.navigate('AdminAddVolunteer')} />
      <ConfirmationModal
        isVisible={deleteModalVisibility}
        title="Delete"
        text="Are you sure you want to delete this volunteer?"
        onCancel={toggleDeleteModalVisibility}
        onConfirm={onConfirm}
      />
      {volunteers && volunteers.map((volunteer) => (
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
