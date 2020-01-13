import React, { FC, useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';

import Input from '../InputWithInlineLabel';
import Button from '../ButtonWithInlineLabel';
import Dropdown from '../Dropdown';
import { Forms } from '../enums';
import SubmitButton from '../SubmitButton';

/*
 * Types
 */
export type UserValues = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  postcode: string;
  gender: string;
  birthYear: number;
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
  { id: 3, name: 'prefer not to say' },
];

const birthYears = [...Array(130).keys()].map((_, i) => ({ id: i, name: 2019 - i }));

const UserForm: FC<Props> = ({ onSubmit, initialValues = {} }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postcode, setPostcode] = useState('');

  const [gender, setGender] = useState('');
  const [birthYear, setYear] = useState<number>();


  const useSubmit = useCallback(() => {
    onSubmit({
      id: initialValues ? initialValues.id : null,
      name,
      email,
      phoneNumber,
      postcode,
      gender,
      birthYear,
    });
  }, [name, email, phoneNumber, postcode, gender, birthYear]);

  return (
    <Form>
      <Input label="Full name" onChangeText={setName} value={name} defaultValue={initialValues.name} />
      <Input label="Email" editable onChangeText={setEmail} value={email} defaultValue={initialValues.email} />
      <Button label="Password" text="Send password reset email" />
      <Input label="Number" onChangeText={setPhoneNumber} value={phoneNumber} defaultValue={initialValues.phoneNumber} />
      <Dropdown label="Gender" options={genders} onValueChange={setGender} selectedValue={gender} defaultValue={initialValues.gender} />
      <Dropdown label="Year of birth" options={birthYears} onValueChange={setYear} selectedValue={birthYear} defaultValue={initialValues.birthYear} />
      <Input label="Post code" onChangeText={setPostcode} value={postcode} defaultValue={initialValues.postcode} />
      <SubmitButton text="SAVE" onPress={useSubmit} />
    </Form>
  );
};

export default UserForm;
