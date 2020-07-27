import React, { FC, useEffect, useState } from 'react';

import Page from '../../../lib/ui/Page';
import UserForm from '../../../lib/ui/forms/UserForm';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { loadVolunteers, selectOrderedVolunteers } from '../../../redux/entities/volunteers';

import API from '../../../api';

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
// get user data
// pass into userForm 
// create submit function 


const Profile: FC<Props> = () => {
  const [userData, setUserData] = useState('');
  // const dispatch = useDispatch();
  // const volunteers = useSelector(selectOrderedVolunteers);

  const onSubmit = async (changes) => {
    await API.Authentication.update(changes);
  }

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data } = await API.Authentication.userData();
    setUserData(data);
    return data;
  }

  if (userData == '') {
    return null;
  }
  return (
    <Page heading="Profile">
      <UserForm
        action='update'
        defaultValues={userData}
        onSubmit={(changes) => { onSubmit(changes) }}
      />
    </Page>
  );
}

export default Profile;
