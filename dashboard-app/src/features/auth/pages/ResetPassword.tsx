import React from 'react';
import styled from 'styled-components';
import * as Joi from '@hapi/joi';
import { AxiosError } from 'axios';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Formik, Form as _Form } from 'formik';

import { CbAdmins } from '../../../lib/api';
import { Response } from '../../../lib/util/response';
import Input from '../../../lib/ui/components/Input';
import { SubmitButton } from '../../../lib/ui/components/Buttons';
import { redirectOnError, withParams, getQueryObjectFromProps } from '../../../lib/util/routing';
import { validateForm } from '../../../lib/util/forms';
import { H1 } from '../../../lib/ui/components/Headings';
import { SpacingEnum } from '../../../lib/ui/design_system';


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
  width: 100%;
  text-align: left;
  margin-top: ${SpacingEnum.small};
`;


const FormContainer = styled.div`
  margin-top: 9.2rem;
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
const ResetPassword: React.FunctionComponent<ResetPasswordProps> = (props) => (
  <Grid>
    <Row center="xs">
      <Col xs={12} lg={6}>
      <H1>Reset Password</H1>
        <Row center="xs">
          <Col xs={6}>
            <FormContainer>
              <Formik
                initialValues={{ password: '', passwordConfirm: '' }}
                onSubmit={(values, actions) => {
                  const query = getQueryObjectFromProps(props);
                  const email = typeof query.email === 'string' ? query.email : query.email[0];

                  CbAdmins.resetPassword({
                    ...values,
                    email,
                    token: props.match.params.token,
                  })
                    .then(() => props.history.push(
                      withParams('/login', { referrer: 'reset_password' })))
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
            </FormContainer>
          </Col>
        </Row>
      </Col>
    </Row>
  </Grid>
);

export default withRouter(ResetPassword);
