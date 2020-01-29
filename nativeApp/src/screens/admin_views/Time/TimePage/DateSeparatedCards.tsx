import React, { FC, useEffect, useState } from 'react';
import moment from 'moment';

import TimeCard from '../../../../lib/ui/TimeCard';
import CardSeparator from '../../../../lib/ui/CardSeparator';
import { VolunteerLog, User } from '../../../../../../api/src/models';
import { groupLogsByThisWeekLastWeekRest } from './util';
import Loader from '../../../../lib/ui/Loader';


/*
 * Types
 */
type Props = {
  logs: VolunteerLog[];
  volunteers: User[];
  toggleDeleteVisibility: () => void;
}

const DateSeparatedCards: FC<Props> = ({ logs, volunteers, toggleDeleteVisibility }) => {
  const [dateSeparatedLogs, setDateSeparatedLogs] = useState(null);

  useEffect(() => {
    const groupedLogs = groupLogsByThisWeekLastWeekRest(logs);
    setDateSeparatedLogs(groupedLogs);
  }, [logs]);

  return dateSeparatedLogs === null
    ? (<Loader isVisible />)
    : (
      <>
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
            onDelete={toggleDeleteVisibility}
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
            onDelete={toggleDeleteVisibility}
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
            onDelete={toggleDeleteVisibility}
          />
        ))
        }

      </>
    );
};

export default DateSeparatedCards;
