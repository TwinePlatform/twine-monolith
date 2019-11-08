import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { assocPath, dissoc, invertObj } from 'ramda';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { FlexContainerCol } from '../../../shared/components/layout/base';
import { Paragraph, ErrorParagraph } from '../../../shared/components/text/base';
import { Form, PrimaryButton } from '../../../shared/components/form/base';
import LabelledInput from '../../../shared/components/form/LabelledInput';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';
import _Checkbox from '../../../shared/components/form/StyledLabelledCheckbox';
import NavHeader from '../../../shared/components/NavHeader';
import { Activities, CommunityBusiness, ErrorUtils } from '../../../api';
import { redirectOnError } from '../../../util';
import ActivityLabel from './ActivityLabel';
import CategorySelect from './CategorySelect';
import { colors } from '../../../shared/style_guide';


const SubmitButton = styled(PrimaryButton)`
  margin-left: 2em;
  height: 3em;
`;


const Checkbox = styled(_Checkbox)`
  margin: 0 auto;
  width: 2rem;

  & input + label::before {
    border: 0.1rem solid ${colors.light}
  }
`;


const ActivitiesError = styled(ErrorParagraph)`
  opacity: ${props => (props.visible ? '1' : '0')};
  height: 1rem;
  text-align: center;
  margin:0;
  transition: opacity 0.7s ease;
`;

const Table = styled.table`
  background: transparent;
  width: 100%;
  padding: 2em;
  table-layout: fixed;
`;
const TableHead = styled.thead``;
const TableBody = styled.tbody``;
const TableRow = styled.tr`
  height: 3em;
`;
const TableCell = styled.td.attrs(props => ({ colSpan: props.wide ? 5 : 1 }))`
  text-align: ${props => (props.center ? 'center' : 'left')};
  vertical-align: middle;
`;
const TableHeader = styled.th.attrs(props => ({ colSpan: props.wide ? 5 : 1 }))``;


const keyMap = {
  name: 'Activity',
  category: 'Category',
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};
const colToState = invertObj(keyMap);
const columns = Object.values(keyMap);

const doesActivityAlreadyExist = (newActivityName, activitiesObject) =>
  Object.values(activitiesObject).some(({ name }) =>
    name === newActivityName,
  );


export default class ActivitiesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      activities: {
        items: {},
        order: [],
      },
      form: {},
      errors: { view: false },
    };
  }

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

  toggleCheckbox = (id, day) => {
    const current = this.state.activities.items[id][day];

    Activities.update({ id, [day]: !current })
      .then((res) => {
        this.setState(assocPath(['activities', 'items', id], res.data.result));
        this.setState(assocPath(['errors', 'view'], false));
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  addActivity = (e) => {
    e.preventDefault();

    if (doesActivityAlreadyExist(this.state.form.name, this.state.activities.items)) {
      return this.setState({ errors: { general: 'Activity already exists', view: true } });
    }
    return Activities.create(this.state.form)
      .then((res) => {
        this.setState((state) => {
          const item = res.data.result;
          const order = state.activities.order.concat(item.id);
          return {
            ...state,
            activities: {
              items: { ...state.activities.items, [item.id]: item },
              order,
            },
          };
        });
        this.setState(assocPath(['errors', 'view'], false));
      })
      .catch(error =>
        ErrorUtils.errorStatusEquals(error, 409)
          ? this.setState({ errors: { general: 'Activity already exists', view: true } })
          : redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }),
      );
  }


  deleteActivity = (id) => {
    Activities.delete({ id })
      .then(() => {
        this.setState(assocPath(['errors', 'view'], false));
        this.setState((state) => {
          const order = state.activities.order.filter(i => i !== id);
          const items = dissoc(id, state.activities.items);
          return { ...state, activities: { order, items } };
        });
      })
      .catch(error => redirectOnError(this.props.history.push, error, { 403: '/admin/confirm' }));
  }

  updateCategory = (id, e) => {
    const category = e.target.value;
    Activities.update({ id, category })
      .then(() => this.setState(assocPath(['activities', 'items', id, 'category'], category)))
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
        <ActivitiesError visible={errors.view}>
          {errors.general}
        </ActivitiesError>
        <Table>
          <TableHead>
            <TableRow>
              {
                columns.map((col, i) => <TableHeader key={col} wide={i < 2}>{col}</TableHeader>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.state.activities.order.map((id) => {
                const activity = this.state.activities.items[id];
                const k1 = colToState[columns[0]];
                const k2 = colToState[columns[1]];

                return (
                  <TableRow key={activity.id}>
                    <TableCell key={`${activity[k1]}-${k1}`} wide>
                      <ActivityLabel
                        label={activity[k1]}
                        onClick={() => this.deleteActivity(activity.id)}
                      />
                    </TableCell>
                    <TableCell key={`${activity[k2]}-${k2}`} center wide>
                      <CategorySelect
                        id={id}
                        options={this.state.categories}
                        value={activity.category}
                        onChange={e => this.updateCategory(activity.id, e)}
                      />
                    </TableCell>
                    {
                      columns
                        .slice(2)
                        .map(k => colToState[k])
                        .map(k => (
                          <TableCell key={`${activity[k]}-${k}`} center>
                            <Checkbox
                              id={`${activity.id}-${k}`}
                              name={`${activity.id}-${k}`}
                              alt={`${activity.name} ${k} update button`}
                              checked={activity[k]}
                              onChange={() => this.toggleCheckbox(activity.id, k)}
                            />
                          </TableCell>
                        ))
                    }
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </FlexContainerCol>
    );
  }
}

ActivitiesPage.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};
