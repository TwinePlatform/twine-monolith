import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';

import Input from '../../../lib/ui/forms/InputWithInlineLabel';
import Button from '../../../lib/ui/forms/ButtonWithInlineLabel';
import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Heading } from '../../../lib/ui/typography';
import Toggle from '../../../lib/ui/forms/Toggle';
import TermsAndConditons from './TermsAndConditions';
import { Forms } from '../../../lib/ui/forms/enums';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import Page from '../../../lib/ui/Page';
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
const genders = [
  { id: 1, name: 'female' },
  { id: 2, name: 'male' },
  { id: 3, name: 'other' },
];

const years = [...Array(130).keys()].map((_, i) => ({ id: i, name: `${2019 - i}` }));

const Settings: FC<Props> = () => {
  const [gender, setGender] = useState('');
  const [year, setYear] = useState('');
  return (
    <Page>
      <Heading>Settings</Heading>
      <Form>
        <Input label="Full name" />
        <Input label="Email" editable />
        <Button label="Password" text="Send password reset email" />
        <Input label="Number" />
        <Dropdown label="Gender" options={genders} onValueChange={setGender} selectedValue={gender} />
        <Dropdown label="Year of birth" options={years} onValueChange={setYear} selectedValue={year} />
        <Input label="Post code" />
        <Toggle label="Locations reminders" />
        <TermsAndConditons />
        <SubmitButton text="SAVE" onPress={() => {}} />
      </Form>
    </Page>
  );
};

export default Settings;
