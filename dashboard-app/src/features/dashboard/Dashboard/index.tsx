import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 as Heading1 } from '../../../lib/ui/components/Headings';
import { Pages } from '../../navigation/pages';
import Polaroid from '../components/Polaroid';
import { TitlesCopy } from '../copy/titles';
import { NumberDataCard, TextDataCard } from '../components/DataCard/index';
import useDashboardStatistics, {
  activityStatsToProps,
  timeStatsToProps,
  volunteerStatsToProps,
} from './useDashboardStatistics';
import LoadingBoundary from '../../../lib/ui/components/Boundaries/LoadingBoundary';
import ThrowIfError from '../../../lib/ui/components/Boundaries/ThrowIfError';


const H1 = styled(Heading1)`
  margin-bottom: 3rem;
`;

/**
 * Component
 */
const Dashboard: React.FunctionComponent<RouteComponentProps> = (props) => {
  const { loading, error, data } = useDashboardStatistics();

  return (
    <Grid>
      <Row center="xs">
        <Col xs={6}>
          <H1>The Twine Volunteer Dashboard shows how volunteers help your organisation</H1>
        </Col>
      </Row>
      <Row center="xs">
        <LoadingBoundary isLoading={loading}>
          <ThrowIfError error={error} />
          <Col xs={8}>
            <Row>
              <Col xs={6}>
                <Polaroid
                  title={TitlesCopy.Time.title}
                  caption={TitlesCopy.Time.subtitle}
                  callToAction="View data"
                  placeHolder="T"
                  onClick={() => Pages.navigateTo('Time', props.history.push)}
                >
                  <NumberDataCard {...timeStatsToProps(data && data.timeStats)}/>
                </Polaroid>
              </Col>
              <Col xs={6}>
                <Polaroid
                  title={TitlesCopy.Activities.title}
                  caption={TitlesCopy.Activities.subtitle}
                  callToAction="View data"
                  placeHolder="A"
                  onClick={() => Pages.navigateTo('Activity', props.history.push)}
                >
                  <NumberDataCard
                    {...activityStatsToProps(data && data.activityStats)}
                  />
                </Polaroid>
              </Col>
              <Col xs={6}>
                <Polaroid
                  title={TitlesCopy.Volunteers.title}
                  caption={TitlesCopy.Volunteers.subtitle}
                  callToAction="View data"
                  placeHolder="V"
                  onClick={() => Pages.navigateTo('Volunteer', props.history.push)}
                >
                  <TextDataCard {...volunteerStatsToProps(data && data.volunteerStats)} />
                </Polaroid>
              </Col>
              <Col xs={6}>
                <Polaroid
                  title="Projects"
                  caption="See what projects volunteers spend their time doing."
                  callToAction="Coming soon"
                  placeHolder="P"
                  disabled
                />
              </Col>
            </Row>
          </Col>
        </LoadingBoundary>
      </Row>
    </Grid>
  );
};

export default withRouter(Dashboard);
