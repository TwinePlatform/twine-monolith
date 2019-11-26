import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { assocPath, dissoc } from 'ramda';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { BeatLoader } from 'react-spinners';
import { FlexContainerCol } from '../../../shared/components/layout/base';
import { Paragraph, ErrorParagraph } from '../../../shared/components/text/base';
import { Form, PrimaryButton } from '../../../shared/components/form/base';
import LabelledInput from '../../../shared/components/form/LabelledInput';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';
import NavHeader from '../../../shared/components/NavHeader';
import ActivityTable from './ActivityTable';
import { Activities, CommunityBusiness, ErrorUtils } from '../../../api';
import { redirectOnError } from '../../../util';
import { colors } from '../../../shared/style_guide';


const SubmitButton = styled(PrimaryButton)`
  margin-left: 2em;
  height: 3em;
`;

const HideableContainer = styled.div`
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.4s ease;
`;

const ActivitiesError = styled(ErrorParagraph)`
  height: 1rem;
  margin:0;
`;


const doesActivityAlreadyExist = (newActivityName, activitiesObject) =>
  Object.values(activitiesObject)
    .some(({ name }) => name === newActivityName);


export default class ActivitiesPage extends React.Component {
  state = {
    categories: [],
    activities: {
      items: {},
      order: [],
    },
    form: {},
    errors: {},
    isSaving: {
      value: false,
      set: 0,
    },
  };

  componentDidMount() {
    Promise.all([Activities.get(), CommunityBusiness.getActivities()])
      .then(([{ data: { result: activities } }, { data: { result: categories } }]) => {
        const order = activities.map(activity => activity.id).sort((l, r) => l.id - r.id);
        const items = activities.reduce((acc, activity) => {
          acc[activity.id] = activity;
          return acc;
        }, {});

        this.setState({
          activities: { items, order },
          categories: [{ id: -1, name: '' }].concat(categories).map(({ id, name }) => ({ key: id, value: name })),
        });
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  onChange = e =>
    this.setState(assocPath(['form', e.target.name], e.target.value))

  showLoader = () => {
    this.setState({ isSaving: { value: true, set: Date.now() }, errors: {} });
  }

  hideLoader = (timeout = 2000) => {
    const remaining = timeout - (Date.now() - (this.state.isSaving.set || Date.now()));
    setTimeout(() => this.setState({ isSaving: { value: false, set: Date.now() } }), remaining);
  }

  toggleCheckbox = (id, day) => {
    const current = this.state.activities.items[id][day];

    this.showLoader();

    Activities.update({ id, [day]: !current })
      .then((res) => {
        this.setState(assocPath(['activities', 'items', id], res.data.result));
        this.hideLoader();
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  addActivity = (e) => {
    e.preventDefault();

    if (doesActivityAlreadyExist(this.state.form.name, this.state.activities.items)) {
      return this.setState({ errors: { general: 'Activity already exists' } });
    }

    this.showLoader();

    return Activities.create(this.state.form)
      .then((res) => {
        this.setState((state) => {
          const item = res.data.result;
          const order = state.activities.order.concat(item.id);
          return {
            ...state,
            form: { name: '', category: '' },
            activities: {
              items: { ...state.activities.items, [item.id]: item },
              order,
            },
          };
        }, () => this.hideLoader());
      })
      .catch(error =>
        ErrorUtils.errorStatusEquals(error, 409)
          ? this.setState({ errors: { general: 'Activity already exists' } })
          : redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }),
      );
  }

  deleteActivity = (id) => {
    this.showLoader();
    Activities.delete({ id })
      .then(() => {
        this.setState((state) => {
          const order = state.activities.order.filter(i => i !== id);
          const items = dissoc(id, state.activities.items);
          return { ...state, activities: { order, items } };
        }, () => this.hideLoader());
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  updateCategory = (id, e) => {
    const category = e.target.value;

    this.showLoader();
    Activities.update({ id, category })
      .then(() => {
        this.setState(assocPath(['activities', 'items', id, 'category'], category));
        this.hideLoader();
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  render() {
    const { errors } = this.state;
    return (
      <FlexContainerCol expand>
        <NavHeader
          leftTo="/admin"
          leftContent="Back to dashboard"
          centerContent="Activities List"
        />
        <Paragraph>
          Add and edit the services, activities, and events being offered at your community
          business here. You can select which days of the week each of them will be available
          to your visitors, and just deselect all days if the one you are editing is a one-off
          event or not currently on the agenda.
        </Paragraph>
        <Grid>
          <Form onSubmit={this.addActivity} onChange={this.onChange}>
            <Row middle="xs" around="xs">
              <Col md={5}>
                <LabelledInput
                  id="cb-admin-activities-name"
                  label="Add an activity"
                  name="name"
                  type="text"
                  value={this.state.form.name}
                  error={errors.activity}
                  required
                />
              </Col>
              <Col md={5}>
                <LabelledSelect
                  id="cb-admin-activities-category"
                  label="Category"
                  name="category"
                  options={this.state.categories}
                  value={this.state.form.category}
                  error={errors.activity}
                  required
                />
              </Col>
              <Col md={2}>
                <SubmitButton type="submit">ADD</SubmitButton>
              </Col>
            </Row>
          </Form>
        </Grid>
        <Row center="xs">
          <HideableContainer visible={this.state.isSaving.value}>
            <BeatLoader color={colors.highlight_primary} />
            <span>Saving changes...</span>
          </HideableContainer>
        </Row>
        <Row center="xs">
          <HideableContainer visible={errors.general}>
            <ActivitiesError>{errors.general}</ActivitiesError>
          </HideableContainer>
        </Row>
        <ActivityTable
          activities={this.state.activities}
          categories={this.state.categories}
          onDelete={this.deleteActivity}
          onChangeCategory={this.updateCategory}
          onToggleActivity={this.toggleCheckbox}
        />
      </FlexContainerCol >
    );
  }
}

ActivitiesPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
