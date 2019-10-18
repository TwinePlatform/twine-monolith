import React, { FC } from 'react';
// import styled from 'styled-components/native';

import TimeCard from '../../../lib/ui/TimeCard';
import Page from '../../../lib/ui/Page';

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
const Time: FC<Props> = () => (
  <Page heading="Volunteer Time">
    <TimeCard id={1} timeValues={[2, 9]} labels={['General', 'Office Work']} date="30/04/19" />
    <TimeCard id={1} timeValues={[7, 19]} labels={['General', 'Office Work']} date="03/06/19" />
    <TimeCard id={1} timeValues={[0, 49]} labels={['General', 'Office Work']} date="15/07/19" />
    <TimeCard id={1} timeValues={[2, 12]} labels={['General', 'Office Work']} date="30/08/19" />
    <TimeCard id={1} timeValues={[2, 18]} labels={['General', 'Office Work']} date="30/09/19" />
  </Page>

);

export default Time;
