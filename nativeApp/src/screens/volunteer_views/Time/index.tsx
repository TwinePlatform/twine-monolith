import React, { FC, useEffect } from 'react';
import moment from 'moment';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import TimeCard from '../../../lib/ui/TimeCard';
import Page from '../../../lib/ui/Page';
import CardSeparator from '../../../lib/ui/CardSeparator';
import ConfirmationModal from '../../../lib/ui/modals/ConfirmationModal';
import BadgeModal from '../../../lib/ui/modals/BadgeModel';
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

/*
 * Component
 */
const Time: FC<Props> = () => {
  const [visibleConfirmationModal, toggleDeleteVisibility] = useToggle(false);
  const [visibleBadgeModal, toggleVisibility] = useToggle(false);
  const logs = useSelector(selectOrderedLogs, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadLogs());
  }, []);

  // const SeeModel = () => {
  //   toggleVisibility();
  //   setTimeout(() => {
  //     toggleVisibility();
  //   }, 3000);
  // }

  // const badge = BadgeObj.FirstLogBadge;

  const onDelete = (id) => {
    toggleDeleteVisibility;
    dispatch(deleteLog(id));
  }

  return (
    <Page heading="My Time">

      {/* <TouchableHighlight
        onPress={() => {
          SeeModel();
        }}
      >
        <Text>Pop up</Text>
      </TouchableHighlight>

      <BadgeModal
        isVisible={visibleBadgeModal}
        badge={badge}
      /> */}

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
            labels={[log.project || 'General', log.activity]}
            date={moment(log.startedAt).format('DD/MM/YY')}
            onDelete={() => { onDelete(log.id) }}
            navigationPage='VolunteerEditTime'
          />
        ))
      }
    </Page>
  );
};

export default Time;
