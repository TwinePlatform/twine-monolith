import React, { FC, useEffect } from 'react';
// import styled from 'styled-components/native';

import { useDispatch, useSelector } from 'react-redux';
import { Heading } from '../../../lib/ui/typography';
import Page from '../../../lib/ui/Page';
import RegistrationForm from './RegistrationForm';
import { loadGenders, selectOrderedGenders } from '../../../redux/constants/genders';
import { selectOrderedBirthYears } from '../../../redux/constants/birthYears';
import { selectOrderedRegions, loadRegions } from '../../../redux/constants/regions';
import { loadOrganisations, selectOrderedOrganisations } from '../../../redux/constants/organisations';

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
const Register: FC<Props> = () => {
// TODO make request through redux

  const dispatch = useDispatch();
  const genders = useSelector(selectOrderedGenders);
  const birthYears = useSelector(selectOrderedBirthYears);
  const regions = useSelector(selectOrderedRegions);
  const organisations = useSelector(selectOrderedOrganisations);

  useEffect(() => {
    dispatch(loadGenders());
    dispatch(loadRegions());
  }, []);

  const getOrganisations = ((regionId: number) => {
    dispatch(loadOrganisations(regionId));
  });

  return (
    <Page heading="Register">
      <RegistrationForm
        onSubmit={() => {}}
        genders={genders}
        birthYears={birthYears}
        regions={regions}
        organisations={organisations}
        getOrganisations={getOrganisations}
      />
    </Page>
  );
};

export default Register;
