import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';
import useForm from 'react-hook-form';
import * as yup from 'yup';

import Input from '../InputWithInlineLabel';
import Button from '../ButtonWithInlineLabel';
import Dropdown from '../Dropdown';
import { Forms } from '../enums';
import SubmitButton from '../SubmitButton';
import { User, GenderEnum } from '../../../../../../api/src/models';

/*
 * Types
 */
type Props = {
  action: 'create' | 'update';
  onSubmit: (v: Partial<User>) => void;
  initialValues?: Partial<User>;
}

/*
 * Styles
 */
const Form = styled(F)`
  width: ${Forms.formWidth}
`;

/*
 * Helpers
 */

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3)
    .max(30)
    .matches({ regex: /^[a-zA-Z]{2,}\s?[a-zA-z]*['-]?[a-zA-Z]*['\- ]?([a-zA-Z]{1,})?/ })
    .required(),
  email: yup.string().email().required(),
  phoneNumber: yup.number().required(),
  postCode: yup.string().required(),
});

// TODO: get from api
const genders = [
  { id: 1, name: 'female' },
  { id: 2, name: 'male' },
  { id: 3, name: 'prefer not to say' },
];

const birthYears = [...Array(130).keys()].map((_, i) => ({ id: i, name: 2019 - i }));

const camelToReadable = (string: string) => string.replace(/(W)/, ' $1');

/*
 * Component
 */
const UserForm: FC<Props> = ({ action, onSubmit, initialValues = {} }) => {
  const {
    register, setValue, handleSubmit, errors,
  } = useForm({ validationSchema });

  const [gender, setGender] = useState<GenderEnum>();
  const [birthYear, setYear] = useState<number>();

  console.log({ errors });

  return (
    <Form>
      <Input
        ref={register({ name: 'name' })}
        label="Full name"
        onChangeText={(text) => setValue('name', text)}
        defaultValue={initialValues.name}
        error={Boolean(errors.name)}
      />
      <Input
        ref={register({ name: 'email' })}
        label="Email"
        onChangeText={(text) => setValue('email', text)}
        defaultValue={initialValues.email}
        error={Boolean(errors.email)}
      />
      { action === 'update' && <Button label="Password" text="Send password reset email" />}
      {/* //TODO - need to send password reset email after creation */}
      <Input
        ref={register({ name: 'phoneNumber' })}
        label="Number"
        onChangeText={(text) => setValue('phoneNumber', text)}
        defaultValue={initialValues.phoneNumber}
        error={Boolean(errors.phoneNumber)}
      />
      <Dropdown label="Gender" options={genders} onValueChange={setGender} selectedValue={gender} defaultValue={initialValues.gender} />
      <Dropdown label="Year of birth" options={birthYears} onValueChange={setYear} selectedValue={birthYear} defaultValue={initialValues.birthYear} />
      <Input
        ref={register({ name: 'postCode' })}
        label="Post code"
        onChangeText={(text) => setValue('postCode', text)}
        defaultValue={initialValues.postCode}
        error={Boolean(errors.postCode)}
      />

      <SubmitButton text="SAVE" onPress={handleSubmit(onSubmit)} />
      {Object.keys(errors).length > 0 && Object.keys(errors).map((key) => (
        <Text key={key}>{camelToReadable(errors[key].message)}</Text>))}
    </Form>
  );
};

export default UserForm;
