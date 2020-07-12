import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import useToggle from '../../../lib/hooks/useToggle';
import InvitationModal from '../../../lib/ui/modals/InvitationModal';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';
import Invite from '../../../lib/ui/Invite';

import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { loadLogs, selectOrderedLogs } from '../../../redux/entities/logs';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

/*
const View = styled.ScrollView`
 flexDirection: column;
 alignItems: center;
 paddingTop: 20;
 paddingBottom: 20;
 paddingLeft: 40;
 paddingRight: 40;
 flex: 1;
`;
*/
const View = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 40,
    paddingRight: 40,
    flex: 1,
    fadingEdgeLength: 10,
  },
}))``;

const Heading = styled(H)`
  flexGrow: 0;
`;

const Container = styled.View`
  width: 100%;
  flexGrow: 1;
  justifyContent: space-between;
`;

const onInvite = () => {
  console.log("invite pressed");
  return <Heading>invite</Heading>
}
/*
 * Component
 */
const AdminHome: FC<Props> = () => {
  const [visibleConfirmationModal, toggleInviteVisibility] = useToggle(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadLogs());
  }, []);

  const logs = useSelector(selectOrderedLogs, shallowEqual);
  let hours = 0;
  let minutes = 0;
  Object.keys(logs).forEach(object => {
    // console.log(logs[object].duration);
    for (let key in logs[object].duration) {
      if (key == 'hours') {
        hours += logs[object].duration[key];
      }
      if (key == 'minutes') {
        minutes += logs[object].duration[key];
      }
    }
  });

  var volunteerNumberArray = new Set();
  Object.keys(logs).forEach(objectnum => {
    // console.log(logs[objectnum].userId);
    volunteerNumberArray.add(logs[objectnum].userId);
  })

  console.log(volunteerNumberArray.size);
  return (

    <View>
      <InvitationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleInviteVisibility}
        onSendClose={toggleInviteVisibility}
        title="Invite Volunteers By Email"
      />
      <Heading>Week Stats</Heading>
      <Container>
        <Stat
          heading="NUMBER OF VOLUNTEERS"
          value={volunteerNumberArray.size}
          unit="people"
        >
          <MaterialIcons name="person-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="TOTAL TIME GIVEN"
          value={hours.toString()}
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="AVERAGE DURATION"
          value={minutes.toString()}
          unit="minutes"
        >
          <MaterialCommunityIcons name="timer" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
      </Container>
      <Invite onPress={toggleInviteVisibility} organisation={"aperture science"} />
    </View>
  );
}


export default AdminHome;
