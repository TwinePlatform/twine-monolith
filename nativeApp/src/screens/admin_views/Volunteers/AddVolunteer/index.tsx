import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import Page from '../../../../lib/ui/Page';
import UserForm from '../../../../lib/ui/forms/UserForm';
import { createVolunteer, selectCreateVolunteerStatus, createVolunteerReset } from '../../../../redux/entities/volunteers';
import { NewVolunteer } from '../../../../api/types';
import { RoleEnum } from '../../../../../../api/src/models/types';

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
  // TODO modal to confirm save
  useEffect(() => {
    if (requestStatus.success) {
      dispatch(createVolunteerReset());
      navigation.navigate('Volunteers');
    }
  }, [requestStatus]);

  const defaultValues = {
    'name': '',
    'email': '',
    'phoneNumber': '',
    'gender': '',
    'birthYear': '',
    'postCode': ''
  };

  const onSubmit = (data: Partial<NewVolunteer>) => {
    // const volunteer = { ...data, role: 'VOLUNTEER' as RoleEnum.VOLUNTEER }; // NB: hack to appease ts & react
    dispatch(createVolunteer(data));
  };

  // TODO display request errors
  return (
    <Page heading="Add Volunteer">
      <UserForm
        action="create"
        onSubmit={onSubmit}
        requestErrors={requestStatus.error}
        defaultValues={defaultValues}
        from='admin'
      />
    </Page>
  );
};

export default withNavigation(AddVolunteer);
