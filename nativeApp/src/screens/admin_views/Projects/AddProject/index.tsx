import React, { FC } from 'react';
// import styled from 'styled-components/native';
import Page from '../../../../lib/ui/Page';
import { Heading } from '../../../../lib/ui/typography';
import Input from '../../../../lib/ui/forms/InputWithInlineLabel';
import SubmitButton from '../../../../lib/ui/forms/SubmitButton';

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
const AddProject: FC<Props> = () => (
  <Page>
    <Heading>Add Project</Heading>
    <Input label="Name" />
    <SubmitButton text="Add Project" onPress={() => {}} />
  </Page>
);

export default AddProject;
