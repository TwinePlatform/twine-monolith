import React, { FC } from 'react';
// import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';
import Page from '../../../../lib/ui/Page';
import UserForm from '../../../../lib/ui/forms/UserForm';
import { createVolunteer } from '../../../../redux/entities/volunteers';
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
const AddVolunteer: FC<Props> = () => {
  const dispatch = useDispatch();

  const onSubmit = (data: Partial<NewVolunteer>) => {
    const volunteer = { ...data, role: 'VOLUNTEER' as RoleEnum.VOLUNTEER }; // NB: hack to appease ts & react
    dispatch(createVolunteer(volunteer));
  };

  // TODO display request errors
  return (
    <Page heading="Add Volunteer">
      <UserForm action="create" onSubmit={onSubmit} />
    </Page>
  );
};

export default AddVolunteer;
