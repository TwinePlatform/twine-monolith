import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid, Row, Col as Column } from 'react-flexbox-grid';
import { SecondaryButton } from '../../shared/components/form/base';
import DotButton from '../../shared/components/form/DottedButton';
import NavHeader from '../../shared/components/NavHeader';
import { Link as StyledLink } from '../../shared/components/text/base';
import { CommunityBusiness } from '../../api';
import { redirectOnError } from '../../util';


const Col = styled(Column)`
  text-align: center;
`;

const ButtonOne = styled(DotButton)`
  width: 14em;
  height: 12em;
  margin: 1em 0;
`;

const ButtonTwo = styled(SecondaryButton) `
  width: 14em;
  height: 12em;
  margin: 1em 0;
`;

const ButtonWrapperLink = styled(StyledLink) `
  margin: 1em;
`;

const Caption = styled.p`
  margin: 1.5em 0 0 0;
  font-size: 0.7em;
  font-style: italic;
`;

const TileButton = props => (
  props.idx % 2 === 0
    ? <ButtonOne>{props.children}</ButtonOne>
    : <ButtonTwo>{props.children}</ButtonTwo>
);

TileButton.propTypes = {
  idx: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]).isRequired,
};

const tilesCopy = [
  { title: 'Activities', caption: state => `Edit what is happening at ${state.orgName}`, link: '/admin/activities' },
  { title: 'Visits', caption: 'See who signed in', link: '/admin/visits' },
  { title: 'Visitors', caption: 'View and edit your visitors\' details', link: '/admin/visitors' },
  { title: 'Account Settings', caption: 'View and edit your business\' details', link: '/admin/settings' },
  { title: 'Feedback', caption: 'See how your visitors feel about your business', link: '/admin/feedback' },
  { title: 'Create Anon Visitor', caption: 'Create a new anonymous account', link: '/admin/visitors/anonymous' },
  { title: 'Under 13 Sign Up', caption: 'For visitors who are under 13 years of age', link: '/admin/visitors/u-13' },
  { title: 'Upload Data', caption: 'Upload your CSV data', link: '/admin/upload' },
];

export default class Dashboard extends React.Component {
  state = {
    orgName: 'your community business',
  }

  componentDidMount() {
    CommunityBusiness.get({ fields: ['name'] })
      .then(res => this.setState({ orgName: res.data.result.name }))
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  render() {
    return (
      <Grid>
        <NavHeader
          leftTo="/"
          leftContent="Back home"
          centerContent="Welcome admin! Where do you want to go?"
        />
        <Row style={{ maxWidth: '768px', margin: '0 auto' }}>
          {
            tilesCopy.map(({ title, link, caption }, i) => (
              <Col xs={12} sm={6} md={4} key={title}>
                <ButtonWrapperLink to={link}>
                  <TileButton idx={i}>
                    {title}
                    <Caption>{typeof caption === 'function' ? caption(this.state) : caption}</Caption>
                  </TileButton>
                </ButtonWrapperLink>
              </Col>
            ))
          }
        </Row>
      </Grid>
    );
  }
}


Dashboard.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
