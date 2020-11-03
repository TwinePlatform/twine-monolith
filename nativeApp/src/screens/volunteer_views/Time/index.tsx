import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import TimeCard from '../../../lib/ui/TimeCard';
import Page from '../../../lib/ui/Page';
import CardSeparator from '../../../lib/ui/CardSeparator';
import ConfirmationModal from '../../../lib/ui/modals/ConfirmationModal';
import BadgeModal from '../../../lib/ui/modals/BadgeModel';
import ViewNoteModal from '../../../lib/ui/modals/ViewNoteModal';
import useToggle from '../../../lib/hooks/useToggle';
import { loadLogs, selectOrderedLogs, selectLogsStatus, deleteLog } from '../../../redux/entities/logs';

import { TouchableHighlight, Alert } from "react-native";
import styled from 'styled-components/native';
import { BadgeObj } from './../VolunteerHome/BadgeObject';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Text = styled.Text`
  marginTop: 10;
`;

const getTruncatedLogs = () => {
  const thirtyDaysAgo = moment().subtract(30, 'days');

  let logArray = useSelector(selectOrderedLogs, shallowEqual);

  let truncatedLogs = [];

  logArray.map((log,index)=>{
    console.log(log.startedAt + log.createdAt + " " +index);
    if(moment(log.startedAt).isAfter(thirtyDaysAgo)){
      truncatedLogs.push(log)
    }
  });

  //only show most recent 50 logs
  truncatedLogs = truncatedLogs.slice(0,50);

  return truncatedLogs;
};

/*
 * Component
 */
const Time: FC<Props> = () => {
  const [visibleConfirmationModal, toggleDeleteVisibility] = useToggle(false);
  const [displayedLogs, setDisplayedLogs] = useState(false);
  const logs = getTruncatedLogs();
  const [visibleNoteModal, toggleVisibilityNoteModal] = useToggle(false);
  const [noteDisplay, setNoteDisplay] = useState('');
  const dispatch = useDispatch();

  const [dateSeparatedLogs, setDateSeparatedLogs] = useState({
    thisWeek: [], lastWeek: [], rest: [],
  });

  useEffect(() => {
    dispatch(loadLogs());
  }, []);

  useEffect(() => {
    if (!displayedLogs && logs[0]) {
      const now = moment();
      const lastWeek = moment().subtract(1, 'week');
      const twoWeeksAgo = moment().subtract(2, 'weeks');
      const groupedLogs = logs.reduce((acc, log) => {
        if (moment(log.startedAt).isBetween(lastWeek, now)) {
          return { ...acc, thisWeek: [...acc.thisWeek, log] };
        } if (moment(log.startedAt).isBetween(twoWeeksAgo, lastWeek)) {
          return { ...acc, lastWeek: [...acc.lastWeek, log] };
        }
        return { ...acc, rest: [...acc.rest, log] };
      }, { thisWeek: [], lastWeek: [], rest: [] });

      setDateSeparatedLogs(groupedLogs);
      setDisplayedLogs(true);
    }
  });

  const onDelete = (id) => {
    toggleDeleteVisibility;
    dispatch(deleteLog(id));
  }

  return (
    <Page heading="My Time">

      <ConfirmationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleDeleteVisibility}
        onConfirm={toggleDeleteVisibility}
        title="Delete"
        text="Are you sure you want to delete this time?"
      />

      <ViewNoteModal
        isVisible={visibleNoteModal}
        onClose={toggleVisibilityNoteModal}
        note={noteDisplay}
      />

      <CardSeparator title="This Week" />
      {
        dateSeparatedLogs.thisWeek.map((log) => (
          <TimeCard
            key={log.id}
            id={log.id}
            timeValues={[log.duration.hours || 0, log.duration.minutes || 0]}
            labels={[log.project || 'General', log.activity]}
            startTime={moment(log.startedAt).format('YYYY-MM-DDTHH:mm:ss')}
            date={moment(log.startedAt).format('DD/MM/YY')}
            onDelete={() => { onDelete(log.id) }}
            toggleVisibilityNoteModal={toggleVisibilityNoteModal}
            setNoteDisplay={setNoteDisplay}
            navigationPage='VolunteerEditTime'
          />
        ))
      }
      <CardSeparator title="Last Week" />
      {
        dateSeparatedLogs.lastWeek.map((log) => (
          <TimeCard
            key={log.id}
            id={log.id}
            timeValues={[log.duration.hours || 0, log.duration.minutes || 0]}
            labels={[log.project || 'General', log.activity]}
            startTime={moment(log.startedAt).format('YYYY-MM-DDTHH:mm:ss')}
            date={moment(log.startedAt).format('DD/MM/YY')}
            onDelete={() => { onDelete(log.id) }}
            toggleVisibilityNoteModal={toggleVisibilityNoteModal}
            setNoteDisplay={setNoteDisplay}
            navigationPage='VolunteerEditTime'
          />
        ))
      }
      <CardSeparator title="Older Logs" />
      {
        dateSeparatedLogs.rest.map((log) => (
          <TimeCard
            key={log.id}
            id={log.id}
            timeValues={[log.duration.hours || 0, log.duration.minutes || 0]}
            labels={[log.project || 'General', log.activity]}
            startTime={moment(log.startedAt).format('YYYY-MM-DDTHH:mm:ss')}
            date={moment(log.startedAt).format('DD/MM/YY')}
            onDelete={() => { onDelete(log.id) }}
            toggleVisibilityNoteModal={toggleVisibilityNoteModal}
            setNoteDisplay={setNoteDisplay}
            navigationPage='VolunteerEditTime'
          />
        ))
      }
    </Page>
  );
};

export default Time;
