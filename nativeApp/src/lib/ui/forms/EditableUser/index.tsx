import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';

import Input from '../InputWithInlineLabel';
import Button from '../ButtonWithInlineLabel';
import Dropdown from '../Dropdown';
import Toggle from '../Toggle';
import TermsAndConditonsButton from './TermsAndConditionsButton';
import { Forms } from '../enums';
import SubmitButton from '../SubmitButton';

/*
 * Types
 */
type UserValues = {
  name: string;
  email: string;
  number: string;
  postcode: string;
  gender: string;
  year: string;
}

type Props = {
  onSubmit: (v: UserValues) => void;
  initialValues?: UserValues;
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

const EditableUser: FC<Props> = ({ onSubmit, initialValues = {} }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [postcode, setPostcode] = useState('');

  const [gender, setGender] = useState('');
  const [year, setYear] = useState('');

  const useSubmit = () => {
    useEffect(() => {
      onSubmit({
        name,
        email,
        number,
        postcode,
        gender,
        year,
      });
    }, [name, email, number, postcode, gender, year]);
  };
  return (
    <Form>
      <Input label="Full name" onChangeText={setName} value={name} defaultValue={initialValues.name} />
      <Input label="Email" editable onChangeText={setEmail} value={email} defaultValue={initialValues.email} />
      <Button label="Password" text="Send password reset email" />
      <Input label="Number" onChangeText={setNumber} value={number} defaultValue={initialValues.number} />
      <Dropdown label="Gender" options={genders} onValueChange={setGender} selectedValue={gender} defaultValue={initialValues.gender} />
      <Dropdown label="Year of birth" options={years} onValueChange={setYear} selectedValue={year} defaultValue={initialValues.year} />
      <Input label="Post code" onChangeText={setPostcode} value={postcode} defaultValue={initialValues.postcode} />
      <Toggle label="Locations reminders" />
      <TermsAndConditonsButton />
      <SubmitButton text="SAVE" onPress={useSubmit} />
    </Form>
  );
};

export default EditableUser;
