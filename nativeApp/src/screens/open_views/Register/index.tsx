import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';

import { useDispatch, useSelector } from 'react-redux';
import { NavigationInjectedProps } from 'react-navigation';
import Page from '../../../lib/ui/Page';
import RegistrationForm from './RegistrationForm';
import { loadGenders, selectOrderedGenders } from '../../../redux/constants/genders';
import { selectOrderedBirthYears } from '../../../redux/constants/birthYears';
import { selectOrderedRegions, loadRegions } from '../../../redux/constants/regions';
import { loadOrganisations, selectOrderedOrganisations } from '../../../redux/constants/organisations';
import { createVolunteer, selectCreateVolunteerStatus } from '../../../redux/entities/volunteers';
import { NewVolunteer } from '../../../api/types';
import useToggle from '../../../lib/hooks/useToggle';
import ContinueModal from '../../../lib/ui/modals/ContinueModal';

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
const Register: FC<Props & NavigationInjectedProps> = ({ navigation }) => {
  // Redux

  const dispatch = useDispatch();
  const genders = useSelector(selectOrderedGenders);
  const birthYears = useSelector(selectOrderedBirthYears);
  const regions = useSelector(selectOrderedRegions);
  const organisations = useSelector(selectOrderedOrganisations);

  const requestErrors = useSelector(selectCreateVolunteerStatus);

  // Local State
  const [responseModal, toggleResponseModal] = useToggle(false);

  // Hooks
  useEffect(() => {
    dispatch(loadGenders());
    dispatch(loadRegions());
  }, []);

  useEffect(() => {
    if (requestErrors.success) {
      toggleResponseModal();
    }
  }, [requestErrors.success]);

  // Callbacks
  const getOrganisations = ((regionId: number) => {
    dispatch(loadOrganisations(regionId));
  });

  // Handlers
  const onSubmit = (volunteer: Partial<NewVolunteer>) => {
    dispatch(createVolunteer(volunteer));
  };

  const onContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <Page heading="Register">
      <ContinueModal
        isVisible={responseModal}
        onContinue={onContinue}
        text="Account Created"
      />
      <RegistrationForm
        onSubmit={onSubmit}
        genders={genders}
        birthYears={birthYears}
        regions={regions}
        organisations={organisations}
        getOrganisations={getOrganisations}
        requestErrors={requestErrors}
      />
    </Page>
  );
};

export default Register;
