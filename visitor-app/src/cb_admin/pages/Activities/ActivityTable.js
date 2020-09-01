import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { invertObj } from 'ramda';
import ActivityLabel from './ActivityLabel';
import CategorySelect from './CategorySelect';
import _Checkbox from '../../../shared/components/form/StyledLabelledCheckbox';
import { colors } from '../../../shared/style_guide';


const Checkbox = styled(_Checkbox)`
  margin: 0 auto;
  width: 2rem;

  & input + label::before {
    border: 0.1rem solid ${colors.light}
  }
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

// This component is memoized using React.memo to avoid expensive re-renders
// caused by the `activities` prop (which is an object, so changes by reference
// but not by value).
//
// This caused a very noticable performance improvement, in particular it reduced
// the percieved lag between keystrokes when entering a new activity
const ActivityTable = React.memo(({
  activities,
  categories,
  onDelete,
  onChangeCategory,
  onToggleActivity,
}) => (
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
        activities.order.map((id) => {
          const activity = activities.items[id];
          const k1 = colToState[columns[0]];
          const k2 = colToState[columns[1]];

          return (
            <TableRow key={activity.id}>
              <TableCell key={`${activity[k1]}-${k1}`} wide>
                <ActivityLabel
                  label={activity[k1]}
                  onClick={() => onDelete(activity.id)}
                />
              </TableCell>
              <TableCell key={`${activity[k2]}-${k2}`} center wide>
                <CategorySelect
                  id={id}
                  options={categories}
                  value={activity.category}
                  onChange={e => onChangeCategory(activity.id, e)}
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
                        onChange={() => onToggleActivity(activity.id, k)}
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
));

ActivityTable.propTypes = {
  activities: PropTypes.shape({
    items: PropTypes.objectOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      category: PropTypes.string,
    })),
    order: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired,
  onChangeCategory: PropTypes.func.isRequired,
  onToggleActivity: PropTypes.func.isRequired,
};

export default ActivityTable;
