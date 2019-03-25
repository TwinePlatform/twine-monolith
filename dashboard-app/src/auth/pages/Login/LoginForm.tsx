import * as Joi from 'joi';
import React from 'react';
import styled from 'styled-components';
import { Formik, Form as _Form, Field, FormikActions } from 'formik';
import Input from '../../../components/Input';
import { SubmitButton } from '../../../components/Buttons';
import { validateForm } from '../../../util/forms';


/**
 * Styled Components
 */
const Form = styled(_Form)`
  width: 40%;
`;

export type FormValues = {
  email: string
  password: string
};

// Form validation schema
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8),
});

type LoginFormProps = {
  onSubmit: (v: FormValues, a: FormikActions<FormValues>) => void
};

/**
 * Component
 */
const LoginForm: React.SFC<LoginFormProps> = (props) => (
  <Formik
    initialValues={{ email: '', password: '' }}
    onSubmit={props.onSubmit}
    validate={validateForm<FormValues>(schema)}
    validateOnBlur={false}
    validateOnChange={false}
  >
    {({ errors, touched }) => (
      <Form>
        <Field
          name="email"
          render={(props: any) =>
            <Input
              {...props.field}
              type="email"
              label="E-mail"
              required
              error={touched.email && errors.email}
            />
          }
        />
        <Field
          name="password"
          render={(props: any) =>
            <Input
              {...props.field}
              type="password"
              label="Password"
              required
              error={touched.password && errors.password}
            />
          }
        />
        <SubmitButton type="submit">LOGIN</SubmitButton>
      </Form>
    )}
  </Formik>
);

export default LoginForm;
