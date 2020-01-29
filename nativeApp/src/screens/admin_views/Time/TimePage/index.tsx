import React, { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { loadLogs, selectOrderedLogs, selectLogsStatus } from '../../../../redux/entities/logs';
import { loadVolunteers, selectVolunteers } from '../../../../redux/entities/volunteers';
import useToggle from '../../../../lib/hooks/useToggle';

import Page from '../../../../lib/ui/Page';
import ConfirmationModal from '../../../../lib/ui/modals/ConfirmationModal';
import DateSeparatedCards from './DateSeparatedCards';
import Loader from '../../../../lib/ui/Loader';
import { groupLogsByThisWeekLastWeekRest } from './util';

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
      <DateSeparatedCards
        logs={logs}
        volunteers={volunteers}
        toggleDeleteVisibility={toggleDeleteVisibility}
      />

    </Page>

  );
};

export default AdminTime;
