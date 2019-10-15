import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';
import Page from '../../../../lib/ui/Page';
import Input from '../../../../lib/ui/forms/InputWithInlineLabel';
import SubmitButton from '../../../../lib/ui/forms/SubmitButton';
import { Forms } from '../../../../lib/ui/forms/enums';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Form = styled(F)`
  width: ${Forms.formWidth}
`;
/*
 * Component
 */
const AddProject: FC<Props> = () => (
  <Page heading="Add Project">
    <Form>
      <Input label="Project Name" />
      <SubmitButton text="Add Project" onPress={() => {}} />
    </Form>
  </Page>
);

export default AddProject;
