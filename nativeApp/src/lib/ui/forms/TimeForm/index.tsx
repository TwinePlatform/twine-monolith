import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F, Text } from 'native-base';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Dropdown from '../Dropdown';
import { Forms } from '../enums';
import DateTimePicker from '../DateTimePicker';
import { ColoursEnum } from '../../colours';
import HoursAndMinutesText from '../../HoursAndMinutesText';
import SubmitButton from '../SubmitButton';

import { getTimeLabel } from './helpers';
import {
  createLog, selectCreateLogStatus, createLogReset, loadLogs,
} from '../../../../redux/entities/logs';
import { IdAndName } from '../../../../api';
import { User } from '../../../../../../api/src/models';
import ContinueModal from '../../modals/ContinueModal';
import useToggle from '../../../hooks/useToggle';
import { selectCurrentUser } from '../../../../redux/currentUser';

/*
 * Types
 */
export type TimeValues = {
  project: string;
  activity: string;
  volunteer: string;
  date: Date;
  startTime: Date;
  endTime: Date;

}
type Props = {
  defaultValues?: TimeValues;
  activities: IdAndName[];
  projects: IdAndName[];
  volunteers?: User[];
  forUser: 'admin' | 'volunteer'; // TODO replace with role enum from api
}

/*
 * Styles
 */

const Form = styled(F)`
  width: ${Forms.formWidth}
`;

const Label = styled(Text)`
  color: ${ColoursEnum.darkGrey};
  marginTop: 15;
`;

const TimeContainer = styled.View`
  marginTop: 15;
`;

const zeroToNine = [...Array(10).keys()].map((_, i) => ({ id: i, name: `${i}` }));
const zeroToFiftyNine = [...Array(60).keys()].map((_, i) => ({ id: i, name: `${i}` }));

/*
 * Component
 */
const TimeForm: FC<Props & NavigationInjectedProps> = (props) => {
  const {
    forUser, activities, projects, volunteers,
  } = props;

  // redux
  const dispatch = useDispatch();

  const requestStatus = useSelector(selectCreateLogStatus, shallowEqual);

  const currentUser = useSelector(selectCurrentUser, shallowEqual);

  // local state
  const [responseModal, toggleResponseModal] = useToggle(false);

  const [project, setProject] = useState('');
  const [activity, setActivity] = useState('');
  const [volunteer, setVolunteer] = useState('');
  const [date, setDate] = useState<Date>();
  const [hours, setHours] = useState<number>();
  const [minutes, setMinutes] = useState<number>();

  const resetForm = () => {
    setProject('General');
    setActivity('');
    setVolunteer('');
    setDate(undefined);
    setHours(undefined);
    setMinutes(undefined);
  };

  // hooks
  useEffect(() => {
    if (requestStatus.success) {
      toggleResponseModal();
    }
  }, [requestStatus]);

  // handlers
  const onSubmit = () => {
    const values = {
      project,
      activity,
      startedAt: date as string,
      duration: { hours, minutes },
      userId: forUser === 'admin'
        ? volunteers.find((x) => x.name === volunteer).id
        : currentUser.id,
    };
    dispatch(createLog(values));
  };


  const onContinue = () => {
    dispatch(createLogReset());
    resetForm();

    if (forUser === 'admin') dispatch(loadLogs());
    toggleResponseModal();
  };

  return (
    <Form>
      <ContinueModal
        isVisible={responseModal}
        onContinue={onContinue}
        text="Saved"
      />
      {forUser === 'admin' && <Dropdown label="Volunteer" options={volunteers} selectedValue={volunteer} onValueChange={setVolunteer} />}
      {forUser === 'volunteer' && <Label>What project are you volunteering on?</Label>}
      <Dropdown
        label="Project"
        options={projects}
        selectedValue={project}
        onValueChange={setProject}
        defaultValue="General"
      />
      {forUser === 'volunteer' && <Label>What activity are you doing?</Label>}
      <Dropdown label="Activity" options={activities} selectedValue={activity} onValueChange={setActivity} />
      <DateTimePicker
        label="Date"
        value={date}
        onConfirm={setDate}
        mode="date"
        maxDate={new Date()}
      />
      <Dropdown
        label="Hours"
        options={zeroToNine}
        selectedValue={hours}
        onValueChange={setHours}
      />
      <Dropdown
        label="Minutes"
        options={zeroToFiftyNine}
        selectedValue={minutes}
        onValueChange={setMinutes}
      />
      <Label>{getTimeLabel(forUser, volunteer)}</Label>
      <TimeContainer>
        <HoursAndMinutesText align="center" timeValues={[hours, minutes]} />
      </TimeContainer>
      <SubmitButton text="ADD TIME" onPress={onSubmit} />
    </Form>
  );
};

export default withNavigation(TimeForm);
