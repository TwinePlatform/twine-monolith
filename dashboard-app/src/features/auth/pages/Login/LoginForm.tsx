import * as Joi from '@hapi/joi';
import React from 'react';
import styled from 'styled-components';
import { Formik, Form as _Form, Field, FormikActions } from 'formik';
import Input from '../../../../lib/ui/components/Input';
import { SubmitButton } from '../../../../lib/ui/components/Buttons';
import { validateForm } from '../../../../lib/util/forms';
import { SpacingEnum } from '../../../../lib/ui/design_system';


/**
 * Styled Components
 */
const Form = styled(_Form)`
  width: 100%;
  text-align: left;
  margin-top: ${SpacingEnum.small};
  margin-bottom: 1.5rem;
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
const LoginForm: React.FunctionComponent<LoginFormProps> = (props) => (
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
        <SubmitButton type="submit">Log in</SubmitButton>
      </Form>
    )}
  </Formik>
);

export default LoginForm;
