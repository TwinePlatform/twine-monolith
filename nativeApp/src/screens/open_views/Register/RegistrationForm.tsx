import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';
import useForm from 'react-hook-form';
import * as yup from 'yup';


import Input from '../../../lib/ui/forms/InputWithInlineLabel';
import Dropdown from '../../../lib/ui/forms/Dropdown';
import { Forms } from '../../../lib/ui/forms/enums';
import SubmitButton from '../../../lib/ui/forms/SubmitButton';
import { mergeErrorMessages } from '../../../lib/utils/errors';
import { GenderEnum } from '../../../../../api/src/models';
import { ErrorText } from '../../../lib/ui/typography';
import { IdAndName } from '../../../api';

/*
 * Types
 */
type Props = {
  onSubmit: (v: FormData) => void;
  requestErrors: any;
  genders: IdAndName [];
  birthYears: IdAndName [];
  regions: IdAndName [];
  organisations: IdAndName [];
  getOrganisations: (id: number) => void;
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


/*
 * Helpers
 */

// NB: yup has an error with matches. Waiting for fix to be merged & released
const validationSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, 'Name must be at least 3 lettters')
    .max(30, 'Name cannot be longer than 30 letters')
    // .matches({
  // regex: /^[a-zA-Z]{2,}\s?[a-zA-z]*['-]?[a-zA-Z]*['\- ]?([a-zA-Z]{1,})?/,
    //   message: 'Name must not contain special characters',
    // })
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
  // .matches({ regex: /^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i, message: 'Post code must be valid' }),
  region: yup.string()
    .required('Region is required'),
  organisation: yup.string()
    .required('Organisation is required'),
});

/*
 * Component
 */
const RegistrationForm: FC<Props> = ({
  onSubmit, requestErrors, genders, birthYears, regions, organisations, getOrganisations,
}) => {
  const {
    register, setValue, handleSubmit, errors: validationErrors, triggerValidation,
  } = useForm<FormData>({ validationSchema });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors(mergeErrorMessages(validationErrors, requestErrors));
  }, [validationErrors, requestErrors]);

  return (
    <Form>
      <Input
        ref={register({ name: 'name' })}
        label="Full name"
        onChangeText={(text) => setValue('name', text)}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.name)}
      />
      <Input
        ref={register({ name: 'email' })}
        label="Email"
        onChangeText={(text) => setValue('email', text)}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.email)}
      />
      <Input
        ref={register({ name: 'password' })}
        label="Password"
        secureTextEntry
        onChangeText={(text) => setValue('email', text)}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.email)}
      />
      <Input
        ref={register({ name: 'phoneNumber' })}
        label="Number"
        onChangeText={(text) => setValue('phoneNumber', text)}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.phoneNumber)}
      />
      <Dropdown
        ref={register({ name: 'gender' })}
        label="Gender"
        options={genders}
        onValueChange={(text) => setValue('gender', text)}
      />
      <Dropdown
        ref={register({ name: 'birthYear' })}
        label="Year of birth"
        options={birthYears}
        onValueChange={(text) => setValue('birthYear', text)}
      />
      <Input
        ref={register({ name: 'postCode' })}
        label="Post code"
        onChangeText={(text) => setValue('postCode', text)}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.postCode)}
      />

      <Dropdown
        ref={register({ name: 'region' })}
        label="Region"
        options={regions}
        onValueChange={(text) => {
          const { id } = regions.find((region) => region.name === text);
          getOrganisations(id);
          setValue('region', text);
        }}
      />
      <Dropdown
        ref={register({ name: 'organisation' })}
        label="Organisation"
        enabled={Boolean(organisations)}
        options={organisations}
        onValueChange={(text) => setValue('organisation', text)}
      />
      <Input
        ref={register({ name: 'adminCode' })}
        label="Admin code (optional)"
        onChangeText={(text) => setValue('adminCode', text)}
        onBlur={async () => triggerValidation()}
        error={Boolean(errors.adminCode)}
      />

      <SubmitButton text="SAVE" onPress={handleSubmit(onSubmit)} />
      {Object.keys(errors).map((key) => (<ErrorText key={key}>{errors[key]}</ErrorText>))}
    </Form>
  );
};

export default RegistrationForm;
