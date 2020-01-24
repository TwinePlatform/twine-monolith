import React, { FC, useEffect } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import Page from '../../../lib/ui/Page';
import UserForm from '../../../lib/ui/forms/UserForm';
import { selectOrderedGenders, loadGenders } from '../../../redux/constants/genders';
import { selectOrderedBirthYears } from '../../../redux/constants/birthYears';

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
const Profile: FC<Props> = () => {
  const dispatch = useDispatch();
  const genders = useSelector(selectOrderedGenders, shallowEqual);
  const birthYears = useSelector(selectOrderedBirthYears, shallowEqual);

  useEffect(() => {
    if (!genders) {
      dispatch(loadGenders());
    }
  });
  return (
    <Page heading="Settings">
      <UserForm
        onSubmit={() => {}}
        genders={genders}
        birthYears={birthYears}
      />
    </Page>
  );
};

export default Profile;
