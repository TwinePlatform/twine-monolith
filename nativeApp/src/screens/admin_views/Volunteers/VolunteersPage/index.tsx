import React, { FC } from 'react';
// import styled from 'styled-components/native';

import { NavigationFocusInjectedProps } from 'react-navigation';
import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';
import AddBar from '../../../../lib/ui/AddBar';
import useToggle from '../../../../lib/hooks/useToggle';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';

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
  return (
    <Page heading="Volunteers" withAddBar>
      <AddBar title="Add Volunteer" onPress={() => navigation.navigate('AdminAddVolunteer')} />
      <ConfirmationModal
        isVisible={deleteModalVisibility}
        title="Delete"
        text="Are you sure you want to delete this volunteer?"
        onCancel={toggleDeleteModalVisibility}
        onConfirm={toggleDeleteModalVisibility}
      />
      <VolunteerCard id={1} title="Kara Thrace" date="11/11/18" onDelete={toggleDeleteModalVisibility} />
      <VolunteerCard id={1} title="Lee Adama" date="11/11/18" onDelete={toggleDeleteModalVisibility} />
      <VolunteerCard id={1} title="Hera Agathon" date="11/11/18" onDelete={toggleDeleteModalVisibility} />
      <VolunteerCard id={1} title="Tory Foster" date="11/11/18" onDelete={toggleDeleteModalVisibility} />
      <VolunteerCard id={1} title="Ellen Tigh" date="11/11/18" onDelete={toggleDeleteModalVisibility} />
    </Page>
  );
};

export default Volunteers;
