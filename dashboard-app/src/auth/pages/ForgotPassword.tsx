import React from 'react';
import styled from 'styled-components';
import * as Joi from 'joi';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Form as _Form, FormikActions } from 'formik';
import { CbAdmins, Response } from '../../api';
import Input from '../../components/Input';
import { SubmitButton } from '../../components/Buttons';
import NavHeader from '../../components/NavHeader/NavHeader';
import { redirectOnError, withParams } from '../../util/routing';
import { validateForm } from '../../util/forms';
import { AxiosError } from 'axios';


/**
 * Types
 */
interface ForgotPasswordProps extends RouteComponentProps {}


/**
 * Styled Components
 */
const Form = styled(_Form)`
  width: 40%;
`;

/**
 * Helpers
 */
const createSubmitHandler = (props: ForgotPasswordProps) => {
  return (values: { email: string }, actions: FormikActions<{ email: string }>) => {
    CbAdmins.forgotPassword(values)
      .then(() => props.history.push(withParams('/login', { referrer: 'forgot_password' })))
      .catch((err: AxiosError) => {
        const response = err.response;

        if (!response) {
          return redirectOnError(props.history.push, err);

        } else if (Response.statusEquals(response, 400)) {
          actions.setErrors({ email: Response.errorMessage(response) });

        } else {
          redirectOnError(props.history.push, err);

        }
      });
  };
};

// Schema
const schema = Joi.object({ email: Joi.string().email().required() });


/**
 * Component
 */
const ForgotPassword: React.SFC<ForgotPasswordProps> = (props) => (
  <Grid>
    <NavHeader
      centerContent="Forgot Password"
      leftContent="Back to login"
      leftTo="/login"
    />
    <Row middle="xs" style={{ height: '60vh' }}>
      <Col xs={12}>
        <Row center="xs">
          <Formik
            initialValues={{ email: '' }}
            onSubmit={createSubmitHandler(props)}
            validate={validateForm<{ email: string }>(schema)}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <Input
                  type="email"
                  name="email"
                  label="E-mail"
                  value={values.email}
                  onChange={handleChange}
                  required
                  error={(touched.email && errors.email) || ''}
                />
                <SubmitButton type="submit">SUBMIT</SubmitButton>
              </Form>
            )}
          </Formik>
        </Row>
      </Col>
    </Row>
  </Grid>
);

export default withRouter(ForgotPassword);
