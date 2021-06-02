import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Platform } from 'react-native';
import { loadLogs, selectOrderedLogs, selectLogsStatus, deleteLog } from '../../../../redux/entities/logs';
import { loadVolunteers, selectVolunteers } from '../../../../redux/entities/volunteers';
import useToggle from '../../../../lib/hooks/useToggle';

import TimeCard from '../../../../lib/ui/TimeCard';
import Page from '../../../../lib/ui/Page';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import ViewNoteModal from '../../../../lib/ui/modals/ViewNoteModal';
import CardSeparator from '../../../../lib/ui/CardSeparator';
import Loader from '../../../../lib/ui/Loader';
import { truncate } from 'fs';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const truncateLogs = (logs) => {
  const thirtyDaysAgo = moment().subtract(30, 'days');

  let logArray = logs;

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
const AdminTime: FC<Props> = () => {
  const [visibleConfirmationModal, toggleDeleteVisibility] = useToggle(false);
  const [visibleNoteModal, toggleVisibilityNoteModal] = useToggle(false);
  const logs = useSelector(selectOrderedLogs, shallowEqual);
  const [activeLogId, setActiveLogId] = useState(0);
  const [noteDisplay, setNoteDisplay] = useState('');
  const logsRequestStatus = useSelector(selectLogsStatus, shallowEqual);
  const volunteers = useSelector(selectVolunteers, shallowEqual);
  const dispatch = useDispatch();

  const [dateSeparatedLogs, setDateSeparatedLogs] = useState({
    thisWeek: [], lastWeek: [], rest: [],
  });

  useEffect(() => {
    dispatch(loadVolunteers());
    dispatch(loadLogs());
  }, []);

  useEffect(() => {
    if (logs[0]) {
      const now = moment();
      const lastWeek = moment().subtract(1, 'week');
      const twoWeeksAgo = moment().subtract(2, 'weeks');
      const groupedLogs = truncateLogs(logs).reduce((acc, log) => {
        if (moment(log.startedAt).isBetween(lastWeek, now)) {
          return { ...acc, thisWeek: [...acc.thisWeek, log] };
        } if (moment(log.startedAt).isBetween(twoWeeksAgo, lastWeek)) {
          return { ...acc, lastWeek: [...acc.lastWeek, log] };
        }
        return { ...acc, rest: [...acc.rest, log] };
      }, { thisWeek: [], lastWeek: [], rest: [] });

      setDateSeparatedLogs(groupedLogs);
    }
  },[logs]);

  const onDelete = () => {
    toggleDeleteVisibility();
    dispatch(deleteLog(activeLogId));
  }

  return (
    <Page heading="Volunteers Time">
      <ConfirmationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleDeleteVisibility}
        onConfirm={onDelete}
        title="Delete"
        text="Are you sure you want to delete this log?"
      />
      <ViewNoteModal
        isVisible={visibleNoteModal}
        onClose={toggleVisibilityNoteModal}
        note={noteDisplay}
      />
      {Platform.OS === 'android' &&
        <Loader isVisible={logsRequestStatus.isFetching} />
      }

      <CardSeparator title="This Week" />
      {
        dateSeparatedLogs.thisWeek.map((log) => (
          <TimeCard
            key={log.id}
            id={log.id}
            timeValues={[log.duration.hours || 0, log.duration.minutes || 0]}
            labels={[log.project || 'General', log.activity]}
            volunteer={volunteers[log.userId] ? volunteers[log.userId].name : 'Deleted User'}
            date={moment(log.startedAt).format('DD/MM/YY')}
            startTime={moment(log.startedAt).format('YYYY-MM-DDTHH:mm:ss')}
            onDelete={() => { setActiveLogId(log.id);toggleDeleteVisibility() }}
            toggleVisibilityNoteModal={toggleVisibilityNoteModal}
            setNoteDisplay={setNoteDisplay}
            navigationPage='AdminEditTime'
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
            volunteer={volunteers[log.userId] ? volunteers[log.userId].name : 'Deleted User'}
            date={moment(log.startedAt).format('DD/MM/YY')}
            startTime={moment(log.startedAt).format('YYYY-MM-DDTHH:mm:ss')}
            onDelete={()=>{setActiveLogId(log.id);toggleDeleteVisibility()}}
            toggleVisibilityNoteModal={toggleVisibilityNoteModal}
            setNoteDisplay={setNoteDisplay}
            navigationPage='AdminEditTime'
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
            volunteer={volunteers[log.userId] ? volunteers[log.userId].name : 'Deleted User'}
            date={moment(log.startedAt).format('DD/MM/YY')}
            startTime={moment(log.startedAt).format('YYYY-MM-DDTHH:mm:ss')}
            onDelete={()=>{setActiveLogId(log.id);toggleDeleteVisibility()}}
            toggleVisibilityNoteModal={toggleVisibilityNoteModal}
            setNoteDisplay={setNoteDisplay}
            navigationPage='AdminEditTime'
          />
        ))
      }
    </Page>

  );
};

export default AdminTime;
