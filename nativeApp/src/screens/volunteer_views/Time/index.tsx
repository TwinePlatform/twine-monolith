import React, { FC } from 'react';
import moment from 'moment';
import { useSelector, shallowEqual } from 'react-redux';

import TimeCard from '../../../lib/ui/TimeCard';
import Page from '../../../lib/ui/Page';
import CardSeparator from '../../../lib/ui/CardSeparator';
import ConfirmationModal from '../../../lib/ui/modals/ConfirmationModal';
import useToggle from '../../../lib/hooks/useToggle';
import { selectOrderedLogs } from '../../../redux/entities/logs';

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
const Time: FC<Props> = () => {
  const [visibleConfirmationModal, toggleDeleteVisibility] = useToggle(false);
  const logs = useSelector(selectOrderedLogs, shallowEqual);

  return (
    <Page heading="My Time">
      <ConfirmationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleDeleteVisibility}
        onConfirm={toggleDeleteVisibility}
        title="Delete"
        text="Are you sure you want to delete this time?"
      />
      {/* TODO separate logs into time bands */}
      <CardSeparator title="Yesterday" />
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

export default Time;
