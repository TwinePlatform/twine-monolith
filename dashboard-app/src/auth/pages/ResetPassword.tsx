import React from 'react';
import styled from 'styled-components';
import * as Joi from 'joi';
import qs from 'querystring';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Form as _Form } from 'formik';
import { CbAdmins, Response } from '../../api';
import Input from '../../components/Input';
import { SubmitButton } from '../../components/Buttons';
import NavHeader from '../../components/NavHeader/NavHeader';
import { redirectOnError } from '../../util/routing';
import { validateForm } from '../../util/forms';
import { AxiosError } from 'axios';


/**
 * Types
 */
interface Params {
  token: string;
}
interface ResetPasswordProps extends RouteComponentProps<Params> {}


/**
 * Styled Components
 */
const Form = styled(_Form)`
  width: 40%;
`;

const schema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.string().required().only(Joi.ref('password'))
    .options({ language: { any: {
      required: 'password confirmation is required',
      allowOnly: 'must match password',
    } } }),
});

/**
 * Component
 */
const ResetPassword: React.SFC<ResetPasswordProps> = (props) => (
  <Grid>
    <NavHeader
      centerContent="Reset Password"
      leftContent="Back to login"
      leftTo="/login"
    />
    <Row middle="xs" style={{ height: '60vh' }}>
      <Col xs={12}>
        <Row center="xs">
          <Formik
            initialValues={{ password: '', passwordConfirm: '' }}
            onSubmit={(values, actions) => {
              const query = qs.parse(props.location.search.replace('?', ''));
              const email = typeof query.email === 'string' ? query.email : query.email[0];

              CbAdmins.resetPassword({
                ...values,
                email,
                token: props.match.params.token,
              })
                .then(() => props.history.push('/login'))
                .catch((err: AxiosError) => {
                  if (!err.response) {
                    redirectOnError(props.history.push, err);
                  } else if (Response.statusEquals(err.response, 400)) {
                    actions.setErrors(Response.validationError(err.response));
                  } else if (Response.statusEquals(err.response, 401)) {
                    actions.setErrors({ password: Response.errorMessage(err.response) });
                  } else if (Response.statusEquals(err.response, 403)) {
                    actions.setErrors({ password: Response.errorMessage(err.response) });
                  } else {
                    redirectOnError(props.history.push, err);
                  }
                });
            }}
            validate={validateForm<{ password: string, passwordConfirm: string }>(schema)}
          >
            {({ values, errors, touched, handleChange }) => (
              <Form>
                <Input
                  name="password"
                  type="password"
                  label="Password"
                  value={values.password}
                  error={(touched.password && errors.password) || ''}
                  onChange={handleChange}
                />
                <Input
                  name="passwordConfirm"
                  type="password"
                  label="Confirm password"
                  value={values.passwordConfirm}
                  error={(touched.passwordConfirm && errors.passwordConfirm) || ''}
                  onChange={handleChange}
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

export default withRouter(ResetPassword);
