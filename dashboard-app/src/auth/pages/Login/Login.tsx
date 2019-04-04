import React from 'react';
import styled from 'styled-components';
import { Link as L, withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form as _Form, FormikActions } from 'formik';
import { Notification } from 'react-notification';
import { CbAdmins, Response } from '../../../api';
import LoginForm, { FormValues } from './LoginForm';
import { H1, H4 } from '../../../components/Headings';
import { redirectOnError, getQueryObjectFromProps } from '../../../util/routing';
import { colors } from '../../../styles/style_guide';


/**
 * Types
 */
interface LoginProps extends RouteComponentProps {}


/**
 * Styles
 */
const Link = styled(L)`
  margin-top: 2rem;
`;


/**
 * Helpers
 */

// Submit handler creator
const createSubmitHandler = (props: LoginProps) =>
  (values: FormValues, actions: FormikActions<FormValues>) =>
    CbAdmins.login(values)
      .then(() => props.history.push('/'))
      .catch((error) => {
        const res = error.response;

        if (Response.statusEquals(res, 400)) {
          actions.setErrors(Response.validationError(res));
        } else if (Response.statusEquals(res, 401)) {
          actions.setErrors({ email: Response.errorMessage(res) });
        } else if (Response.statusEquals(res, 403)) {
          actions.setErrors({ password: Response.errorMessage(res) });
        } else {
          redirectOnError(props.history.push, error);
        }
      });

// Derive notification message from "referrer" query param
const getMessage = (props: LoginProps) => {
  switch (getQueryObjectFromProps(props).referrer) {
    case 'forgot_password':
      return 'Password reset e-mail has been sent';

    case 'reset_password':
      return 'Password has been reset!';

    default:
      return '';
  }
};


/**
 * Component
 */
const Login: React.SFC<LoginProps> = (props) => (
  <Grid>
    <Row center="xs">
      <Col>
        <H1>Volunteer Dashboard</H1>
      </Col>
    </Row>
    <Row center="xs">
      <Col>
        <H4>Login</H4>
      </Col>
    </Row>
    <Row middle="xs" style={{ height: '60vh' }}>
      <Col xs={12}>
        <Row center="xs">
          <LoginForm
            onSubmit={createSubmitHandler(props)}
          />
        </Row>
        <Row center="xs">
          <Link to="/password/forgot">Forgot your password?</Link>
        </Row>
      </Col>
    </Row>
    <Row center="xs">
      <Notification
        isActive={getMessage(props).length > 0}
        message={getMessage(props)}
        barStyle={{
          backgroundColor: colors.dark,
          left: getMessage(props).length > 0 ? 'inherit' : '-100%',
          marginTop: '3rem',
          borderRadius: '0.2rem',
        }}
      />
    </Row>
  </Grid>
);

export default withRouter(Login);
