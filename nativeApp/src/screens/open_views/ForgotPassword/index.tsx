import React, { FC } from 'react';
// import styled from 'styled-components/native';

import { Heading } from '../../../lib/ui/typography';
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
const ForgotPassword: FC<Props> = () => (
  <Page>
    <Heading>Forgot Password</Heading>
  </Page>
);

export default ForgotPassword;
