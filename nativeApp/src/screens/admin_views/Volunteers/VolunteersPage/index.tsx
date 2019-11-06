import React, { FC, useState, useEffect } from 'react';
import moment from 'moment';
import uuid from 'uuid/v4';

import { ColorDotsLoader } from 'react-native-indicator';

import { NavigationFocusInjectedProps } from 'react-navigation';
import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';
import useToggle from '../../../../lib/hooks/useToggle';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import useRequest from '../../../../lib/hooks/requestHook';
import { CommunityBusinesses } from '../../../../lib/api';
import { ColoursEnum } from '../../../../lib/ui/colours';
import { Status } from '../../../types';

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
  const [status, setStatus] = useState(Status.loading);
  const [deleteModalVisibility, toggleDeleteModalVisibility] = useToggle(false);
  const [activeCard, setActiveCard] = useState(null);
  const [reload, setReload] = useState((navigation.state.params || {}).reload);

  const [volunteers] = useRequest({
    request: CommunityBusinesses.getVolunteers,
    updateOn: [reload],
    setStatus,
  });

  useEffect(() => {
  }, [volunteers]);

  const onDelete = (id: number) => {
    toggleDeleteModalVisibility();
    setActiveCard(id);
  };

  const onConfirm = () => {
    setStatus(Status.loading);
    CommunityBusinesses.deleteVolunteer(activeCard)
      .then(() => {
        setReload(uuid());
        toggleDeleteModalVisibility();
      })
      .catch((e) => {
        setStatus(Status.failed);
        console.log(e);
      }); // TODO: error handling
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

      {status === Status.loading && (
      <ColorDotsLoader
        color1={ColoursEnum.purple}
        color2={ColoursEnum.mustard}
        color3={ColoursEnum.grey}
        size={20}
      />
      )}
      {status !== Status.loading && volunteers && volunteers.map((volunteer) => (
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
