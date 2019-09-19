import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { pathOr } from 'ramda';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Heading, Heading3 } from '../components/text/base';
import { PrimaryButton } from '../components/form/base';


const copy = {
  400: { heading: 'Bad Request', body: 'There was a problem with your request' },
  401: { heading: 'Unauthorised', body: 'Please log in' },
  403: { heading: 'Forbidden', body: 'Insufficient permissions' },
  404: { heading: 'Not Found', body: 'We are sorry, the page you are looking for does not exist.' },
  409: { heading: 'Conflict', body: 'Conflict' },
  500: { heading: 'Internal Error', body: 'We are sorry, there is a problem with our system. Please contact an administrator' },
  501: { heading: 'Not Implemented', body: 'We are sorry, there is a problem with our system. Please contact an administrator' },
  502: { heading: 'Bad Gateway', body: 'We are sorry, there is a problem with our system. Please contact an administrator' },
  default: { heading: 'Unknown error', body: 'We\'re not quite sure what went wrong. Please try again.' },
};
const getTitle = code => pathOr(copy.default.heading, [code, 'heading'], copy);
const getBody = code => pathOr(copy.default.body, [code, 'body'], copy);


const Button = styled(PrimaryButton)`
  margin-top: 3rem;
  padding: 1rem;
`;


const ErrorPage = ({ match, code }) => (
  <Grid>
    <Row>
      <Col xs={12}>
        <Heading>{match.params.code || code}: {getTitle(match.params.code || code)}</Heading>
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={10}>
        <Heading3>{getBody(match.params.code || code)}</Heading3>
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={4}>
        <Button onClick={() => window.location.replace('/')}>Refresh the app</Button>
      </Col>
    </Row>
  </Grid>
);

ErrorPage.propTypes = {
  match: PropTypes.shape({ params: PropTypes.object }).isRequired,
  code: PropTypes.number,
};

ErrorPage.defaultProps = {
  code: -1,
};

export default withRouter(ErrorPage);
