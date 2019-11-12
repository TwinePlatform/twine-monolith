import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { loadLogs, selectOrderedLogs, selectLogsStatus } from '../../../../redux/entities/logs';
import { loadVolunteers, selectVolunteers } from '../../../../redux/entities/volunteers';
import useToggle from '../../../../lib/hooks/useToggle';

import TimeCard from '../../../../lib/ui/TimeCard';
import Page from '../../../../lib/ui/Page';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import CardSeparator from '../../../../lib/ui/CardSeparator';
import Loader from '../../../../lib/ui/Loader';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

/*
 * Component
 */
const AdminTime: FC<Props> = () => {
  const [visibleConfirmationModal, toggleDeleteVisibility] = useToggle(false);
  const logs = useSelector(selectOrderedLogs, shallowEqual);
  const logsRequestStatus = useSelector(selectLogsStatus, shallowEqual);
  const volunteers = useSelector(selectVolunteers, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadVolunteers());
    dispatch(loadLogs());
  }, []);

  return (
    <Page heading="Volunteers Time">
      <ConfirmationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleDeleteVisibility}
        onConfirm={toggleDeleteVisibility}
        title="Delete"
        text="Are you sure you want to delete this time?"
      />
      <Loader isVisible={logsRequestStatus.isFetching} />

      {/* TODO - separate logs into separator headers */}
      <CardSeparator title="Today" />
      {
        logs.map((log) => (
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
    </Page>

  );
};

export default AdminTime;
