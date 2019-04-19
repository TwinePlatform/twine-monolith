import React from 'react';
import styled from 'styled-components';
import { Link as L, withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form as _Form, FormikActions } from 'formik';
import { Notification } from 'react-notification';
import { CbAdmins, Response } from '../../../api';
import LoginForm, { FormValues } from './LoginForm';
import { H1 as _H1, H4 as _H4 } from '../../../components/Headings';
import { redirectOnError, getQueryObjectFromProps } from '../../../util/routing';
import { FontSizeEnum, SpacingEnum, ColoursEnum } from '../../../styles/style_guide';
import Navbar from '../../../components/Navbar';


/*
 * Types
 */
interface LoginProps extends RouteComponentProps {}


/*
 * Styles
 */

// const ResponsivePage = ()
const H1 = styled(_H1)`
margin-top: ${SpacingEnum.medium};
`;

const H4 = styled(_H4)`
margin-top: ${SpacingEnum.small};
`;

const Link = styled(L)`
  font-size: ${FontSizeEnum.medium}
  margin-top: ${SpacingEnum.xSmall};
`;
/*
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


/*
 * Component
 */
const Login: React.SFC<LoginProps> = (props) => (
  <>
  <Navbar loggedIn={false} active={false}/>
  <Grid>
    <Row center="xs">
      <Col>
        <Row>
            <H1>Login to the Twine Volunteer Dashboard</H1>
        </Row>
        <Row>
            <H4>Don't have an account? Register <a href="">here</a></H4>
        </Row>
        <Row>
          <LoginForm
            onSubmit={createSubmitHandler(props)}
          />
          <Link to="/password/forgot">Forgot your password?</Link>
        </Row>
        <Row>
          <Notification
            isActive={getMessage(props).length > 0}
            message={getMessage(props)}
            barStyle={{
              backgroundColor: ColoursEnum.font,
              left: getMessage(props).length > 0 ? 'inherit' : '-100%',
              marginTop: SpacingEnum.medium,
              borderRadius: '0.2rem',
            }}
          />
        </Row>
      </Col>
    </Row>
  </Grid>
  </>
);

export default withRouter(Login);
