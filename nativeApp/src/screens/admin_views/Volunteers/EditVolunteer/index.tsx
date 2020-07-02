import React, { FC, useEffect } from 'react';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { filter } from 'ramda';

import { updateVolunteer, selectUpdateVolunteerStatus, updateVolunteerReset } from '../../../../redux/entities/volunteers';

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
  const volunteerDetails = navigation.state.params;
  const dispatch = useDispatch();
  const requestStatus = useSelector(selectUpdateVolunteerStatus, shallowEqual);

  useEffect(() => {
    if (requestStatus.success) {
      dispatch(updateVolunteerReset());
      navigation.navigate('Volunteers');
    }
  }, [requestStatus]);

  const onSubmit = async (formState) => {
    const changeset = filter(Boolean, formState);
    dispatch(updateVolunteer({ id: volunteerDetails.id, ...changeset }));
  };

  // TODO: modal to show data has been saved

  return (
    <Page heading="Edit Volunteer">
      <UserForm
        onSubmit={onSubmit}
        defaultValues={filter(Boolean, volunteerDetails)}
        action="update"
        requestErrors={requestStatus.error}
      />
    </Page>
  );
};

export default withNavigation(EditVolunteer);
