import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text as T } from 'native-base';
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
  defaultValues?: Partial<User>;
}

type FormData = {
  name: string;
  email: string;
  phoneNumber: string;
  gender: GenderEnum;
  yearOfBirth: string;
  postCode: string;
}


/*
 * Styles
 */
const Form = styled(F)`
  width: ${Forms.formWidth}
`;

const Text = styled(T)`
  marginBottom: 5;
`;

/*
 * Helpers
 */

// NB: yup has an error with matches. Waiting for fix to be merged & released
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 lettters')
    .max(30, 'Name cannot be longer than 30 letters')
    // .matches({ regex: /^[a-zA-Z]{2,}\s?[a-zA-z]*['-]?[a-zA-Z]*['\- ]?([a-zA-Z]{1,})?/, message: 'Name must not contain special characters' })
    .required('Name is required'),
  email: yup.string()
    .email('Email must be valid')
    .required('Email is required'),
  phoneNumber: yup.string()
    .min(9, 'Phone number must be at least 9 digits')
    .max(20, 'Phone number cannot be longer than 20 digits'),
  // .matches({ regex: /^\+?[0-9 -]*$/, message: 'Phone number must be valid' }),
  postCode: yup
    .string()
    .min(4, 'Post code must be at least 4 letters')
    .max(10, 'Post code cannot be longer than 10 letters'),
  // .matches({ regex: /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i, message: 'Post code must be valid' })
});

// TODO: get from api
const genders = [
  { id: 1, name: 'female' },
  { id: 2, name: 'male' },
  { id: 3, name: 'prefer not to say' },
];

const birthYears = [...Array(130).keys()].map((_, i) => ({ id: i, name: `${2019 - i}` }));

/*
 * Component
 */
const UserForm: FC<Props> = ({ action, onSubmit, defaultValues = {} }) => {
  const {
    register, setValue, handleSubmit, errors, triggerValidation, getValues,
  } = useForm<FormData>({ defaultValues, validationSchema });

  return (
    <Form>
      <Input
        ref={register({ name: 'name' })}
        label="Full name"
        onChangeText={(text) => setValue('name', text)}
        defaultValue={defaultValues.name}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.name)}
      />
      <Input
        ref={register({ name: 'email' })}
        label="Email"
        onChangeText={(text) => setValue('email', text)}
        defaultValue={defaultValues.email}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.email)}
      />
      { action === 'update' && <Button label="Password" text="Send password reset email" />}
      {/* //TODO - need to send password reset email after creation */}
      <Input
        ref={register({ name: 'phoneNumber' })}
        label="Number"
        onChangeText={(text) => setValue('phoneNumber', text)}
        defaultValue={defaultValues.phoneNumber}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.phoneNumber)}
      />
      <Dropdown
        ref={register({ name: 'gender' })}
        label="Gender"
        options={genders}
        onValueChange={(text) => setValue('gender', text)}
        defaultValue={defaultValues.gender}
      />
      <Dropdown
        ref={register({ name: 'birthYear' })}
        label="Year of birth"
        options={birthYears}
        onValueChange={(text) => setValue('birthYear', text)}
        defaultValue={defaultValues.birthYear && defaultValues.birthYear.toString()}
      />
      <Input
        ref={register({ name: 'postCode' })}
        label="Post code"
        onChangeText={(text) => setValue('postCode', text)}
        defaultValue={defaultValues.postCode}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.postCode)}
      />

      <SubmitButton text="SAVE" onPress={handleSubmit(onSubmit)} />
      {Object.keys(errors).length > 0 && Object.keys(errors).map((key) => (
        <Text key={key}>{errors[key].message}</Text>))}
    </Form>
  );
};

export default UserForm;
