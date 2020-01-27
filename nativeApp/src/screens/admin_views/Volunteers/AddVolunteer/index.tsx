import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import Page from '../../../../lib/ui/Page';
import UserForm from '../../../../lib/ui/forms/UserForm';
import {
  createVolunteer, selectCreateVolunteerStatus, createVolunteerReset, loadVolunteers,
} from '../../../../redux/entities/volunteers';
import { NewVolunteer } from '../../../../api/types';
import { selectOrderedGenders, loadGenders } from '../../../../redux/constants/genders';
import { selectOrderedBirthYears } from '../../../../redux/constants/birthYears';

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
const AddVolunteer: FC<NavigationInjectedProps & Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const requestStatus = useSelector(selectCreateVolunteerStatus, shallowEqual);
  const genders = useSelector(selectOrderedGenders, shallowEqual);
  const birthYears = useSelector(selectOrderedBirthYears, shallowEqual);

  useEffect(() => {
    if (!genders) {
      dispatch(loadGenders());
    }
  });

  // TODO modal to confirm save
  useEffect(() => {
    if (requestStatus.success) {
      dispatch(createVolunteerReset());
      dispatch(loadVolunteers());
      navigation.navigate('Volunteers');
    }
  }, [requestStatus]);

  const onSubmit = (data: Partial<NewVolunteer>) => {
    const volunteer = { ...data };
    dispatch(createVolunteer(volunteer));
  };

  // TODO display request errors
  return (
    <Page heading="Add Volunteer">
      <UserForm
        action="create"
        onSubmit={onSubmit}
        requestErrors={requestStatus.error}
        birthYears={birthYears}
        genders={genders}
      />
    </Page>
  );
};

export default withNavigation(AddVolunteer);
