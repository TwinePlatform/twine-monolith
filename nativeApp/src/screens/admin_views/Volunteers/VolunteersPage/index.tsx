import React, { FC } from 'react';
// import styled from 'styled-components/native';
import { Heading } from '../../../../lib/ui/typography';
import VolunteerCard from './VolunteerCard';
import Page from '../../../../lib/ui/Page';

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


const Volunteers: FC<Props> = () => (
  <Page>
    <Heading>Volunteers</Heading>
    <VolunteerCard id={1} title="Kara Thrace" date="11/11/18" />
    <VolunteerCard id={1} title="Lee Adama" date="11/11/18" />
    <VolunteerCard id={1} title="Hera Agathon" date="11/11/18" />
    <VolunteerCard id={1} title="Tory Foster" date="11/11/18" />
    <VolunteerCard id={1} title="Ellen Tigh" date="11/11/18" />
  </Page>
);

export default Volunteers;
