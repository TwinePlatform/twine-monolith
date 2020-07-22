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
import {
  RedirectHttpErrorBoundary,
  RenderErrorBoundary
} from '../../../lib/ui/components/Boundaries';

/*
 * Styles
 */
const H1 = styled(Heading1)`
  margin-bottom: 3rem;
`;

/*
 * Components
 */
const VolunteerTile: React.FC<{ stats: any }> = ({ stats }) => (
  stats && <TextDataCard {...volunteerStatsToProps(stats)} />
);

const TimeTile: React.FC<{ stats: any }> = ({ stats }) => (
  stats && <NumberDataCard {...timeStatsToProps(stats)} />
);

const ActivityTile: React.FC<{ stats: any }> = ({ stats }) => (
  stats && <NumberDataCard {...activityStatsToProps(stats)} />
);

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
        <RedirectHttpErrorBoundary loading={loading} error={error}>
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
                  <RenderErrorBoundary>
                    <TimeTile stats={data && data.timeStats} />
                  </RenderErrorBoundary>
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
                  <RenderErrorBoundary>
                    <ActivityTile stats={data && data.activityStats} />
                  </RenderErrorBoundary>
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
                  <RenderErrorBoundary>
                    <VolunteerTile stats={data && data.volunteerStats} />
                  </RenderErrorBoundary>
                </Polaroid>
              </Col>
              <Col xs={6}>
                <Polaroid
                  title={TitlesCopy.Projects.title}
                  caption={TitlesCopy.Projects.subtitle}
                  callToAction="Coming soon"
                  placeHolder="P"
                  disabled
                />
              </Col>
            </Row>
          </Col>
        </RedirectHttpErrorBoundary>
      </Row>
    </Grid>
  );
};

export default withRouter(Dashboard);
