import React, {useState} from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { FormikActions } from 'formik';
import { Notification } from 'react-notification';
import { CbAdmins } from '../../../../lib/api';
import { Response } from '../../../../lib/util/response';
import LoginForm, { FormValues } from './LoginForm';
import { H1 } from '../../../../lib/ui/components/Headings';
import { Paragraph } from '../../../../lib/ui/components/Typography';
import L from '../../../../lib/ui/components/Link';
import { redirectOnError, getQueryObjectFromProps } from '../../../../lib/util/routing';
import { SpacingEnum, ColoursEnum } from '../../../../lib/ui/design_system';
import SupportModal from '../../../../lib/ui/components/SupportModal';


/*
 * Types
 */
interface LoginProps extends RouteComponentProps { }


/*
 * Styles
 */
const RowLeftAlignText = styled(Row)`
  text-align: left !important;
`;

const Link = styled(L)`
  margin-top: ${SpacingEnum.small};
`;

const TextButton = styled(Paragraph)`
  margin-top: ${SpacingEnum.medium};
  cursor:pointer;
  text-decoration:underline;
`;

const FormContainer = styled.div`
  margin-top: 9.2rem;
`;

/*
 * Helpers
 */
// Submit handler creator
const createSubmitHandler = (props: LoginProps) =>
  (values: FormValues, actions: FormikActions<FormValues>) =>
    CbAdmins.login(values)
      .then((response) => {
        props.history.push('/');
        console.log(response);

      })
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
const Login: React.FunctionComponent<LoginProps> = (props) => {
  const [supportModalVisible, setSupportModalVisible] = useState(false);

  const toggleSupportModal = () => {

    console.log("support modal was " + supportModalVisible + "and is now " + !supportModalVisible)
    setSupportModalVisible(!supportModalVisible);
  }

  return (
  <Grid>
    <SupportModal visible={supportModalVisible} closeFunction={()=>setSupportModalVisible(false)}/>
    <Row center="xs">
      <Col xs={12} lg={6}>
        <Row center="xs">
          <H1>Login to the Twine Volunteer Dashboard</H1>
        </Row>
        <Row center="xs">
          <Paragraph>
            Don't have an account? <a href="https://www.twine-together.com/signup/">Register here</a>
          </Paragraph>
        </Row>
        <RowLeftAlignText center="xs">
          <Col xs={6}>
            <FormContainer>
              <LoginForm onSubmit={createSubmitHandler(props)} />
              <Link to="/password/forgot">Forgot your password?</Link>
              <TextButton onClick={()=>toggleSupportModal()}>Having technical issues with Twine?</TextButton>
            </FormContainer>
          </Col>
        </RowLeftAlignText>
        <Row center="xs">
          <Notification
            isActive={getMessage(props).length > 0}
            message={getMessage(props)}
            barStyle={{
              backgroundColor: ColoursEnum.black,
              left: getMessage(props).length > 0 ? 'inherit' : '-100%',
              bottom: 'inherit',
              marginTop: SpacingEnum.small,
              borderRadius: '0.2rem',
            }}
          />
        </Row>
      </Col>
    </Row>
  </Grid>
)};

export default withRouter(Login);
