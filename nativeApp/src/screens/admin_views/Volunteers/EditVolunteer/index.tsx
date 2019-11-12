import React, { FC } from 'react';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { useDispatch } from 'react-redux';
import { filter } from 'ramda';

import { updateVolunteer } from '../../../../redux/entities/volunteers';

import Page from '../../../../lib/ui/Page';
import UserForm from '../../../../lib/ui/forms/UserForm';


/*
 * Types
 */
type Props = {
  // NB: User details are passed through navigation params not props
}

/*
 * Styles
 */

/*
 * Component
 */
const EditVolunteer: FC<NavigationInjectedProps & Props> = ({ navigation }) => {
  const dispatch = useDispatch();

  const onSubmit = async (formState) => {
    const changeset = filter(Boolean, formState);
    dispatch(updateVolunteer(changeset));
    // TODO: modal to show data has been saved
    navigation.navigate('Volunteers');
  };

  return (
    <Page heading="Edit Volunteer">
      <UserForm onSubmit={onSubmit} initialValues={navigation.state.params} />
    </Page>
  );
};

export default withNavigation(EditVolunteer);
