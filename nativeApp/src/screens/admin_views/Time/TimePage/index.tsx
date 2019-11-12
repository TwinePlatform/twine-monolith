import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import TimeCard from '../../../../lib/ui/TimeCard';
import Page from '../../../../lib/ui/Page';
import useToggle from '../../../../lib/hooks/useToggle';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import CardSeparator from '../../../../lib/ui/CardSeparator';
import { loadLogs, selectOrderedLogs } from '../../../../redux/entities/logs';

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
  const dispatch = useDispatch();

  useEffect(() => {
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
      {/* TODO - separate logs into separator headers */}
      <CardSeparator title="Today" />
      {
        logs.map((log) => (
          <TimeCard
            key={log.id}
            id={log.id}
            timeValues={[log.duration.hours || 0, log.duration.minutes || 0]}
            labels={[log.project, log.activity]}
            date={moment(log.startedAt).format('DD/MM/YY')}
            onDelete={toggleDeleteVisibility}
          />
        ))
      }
    </Page>

  );
};

export default AdminTime;
