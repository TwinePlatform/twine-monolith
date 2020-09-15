import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';
import useForm from 'react-hook-form';
import * as yup from 'yup';

import Input from '../InputWithInlineLabel';
import Button from '../ButtonWithInlineLabel';
import Dropdown from '../Dropdown';
import { Forms } from '../enums';
import SubmitButton from '../SubmitButton';
import { User, GenderEnum } from '../../../../../../api/src/models';
import { ErrorText } from '../../typography';

import { Formik } from 'formik';
import { TextInput } from "react-native";

/*
 * Types
 */
type Props = {
  action: 'create' | 'update';
  onSubmit: (v: Partial<User>) => void;
  defaultValues?: Partial<User>;
  requestErrors: any;
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
    // message: 'Name must not contain special characters' })
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

const mergeErrorMessages = (validationErrors, requestErrors) => {
  let errors = {};

  if (validationErrors) {
    const newValidationErrors = Object.keys(validationErrors)
      .reduce((acc, entity) => ({ ...acc, [entity]: validationErrors[entity].message }), {});

    errors = { ...errors, ...newValidationErrors };
  }
  if (requestErrors) {
    if (requestErrors.validation) {
      errors = { ...errors, ...requestErrors.validation };
    } else {
      errors = { ...errors, message: requestErrors.message };
    }
  }

  return errors;
};
/*
 * Component
 */
const UserForm: FC<Props> = ({
  action, onSubmit, defaultValues, requestErrors,
}) => {
  // const {
  //   register, setValue, handleSubmit, errors: validationErrors, triggerValidation,
  // } = useForm<FormData>({ defaultValues, validationSchema });

  // const [errors, setErrors] = useState({});


  // useEffect(() => {
  //   setErrors(mergeErrorMessages(validationErrors, requestErrors));
  // }, [validationErrors, requestErrors]);
  const { name, email, phoneNumber, gender, birthYear, postCode } = defaultValues;

  return (

    <Formik
      initialValues={{
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        gender: gender,
        birthYear: birthYear,
        postCode: postCode
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}>

      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (

        <Form>

          <Input
            label="Full name"
            value={values.name}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
          />
          {errors.name &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.name}</TextInput>
          }

          <Input
            label="Email"
            placeholder={"Email"}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
          />
          {errors.email &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.email}</TextInput>
          }

          {action === 'update' && <Button label="Password" text="Send password reset email" />}

          {/* //TODO - need to send password reset email after creation */}

          <Input
            label="Phone Number"
            placeholder={"phoneNumber"}
            onChangeText={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            value={values.phoneNumber}
          />
          {errors.phoneNumber &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.phoneNumber}</TextInput>
          }


          <Dropdown
            label="Gender"
            options={genders}
            onValueChange={handleChange('gender')}
            defaultValue={values.gender && values.gender.toString()}
          />
          {errors.gender &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.gender}</TextInput>
          }

          <Dropdown
            label="Year of birth"
            options={birthYears}
            onValueChange={handleChange('birthYear')}
            defaultValue={values.birthYear && values.birthYear.toString()}
          />
          {errors.birthYear &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.birthYear}</TextInput>
          }

          <Input
            label="Post Code"
            placeholder={"postCode"}
            onChangeText={handleChange('postCode')}
            onBlur={handleBlur('postCode')}
            value={values.postCode}
          />
          {errors.postCode &&
            <TextInput style={{ fontSize: 10, color: 'red' }}>{errors.postCode}</TextInput>
          }

          <SubmitButton text="SAVE" onPress={handleSubmit} />

        </Form>

      )}
    </Formik>
  );
};

export default UserForm;
