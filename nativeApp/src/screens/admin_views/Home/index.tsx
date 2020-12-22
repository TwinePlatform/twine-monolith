
import React, { FC, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { NavigationInjectedProps } from 'react-navigation';
import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import useToggle from '../../../lib/hooks/useToggle';
import InvitationModal from '../../../lib/ui/modals/InvitationModal';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';
import Invite from '../../../lib/ui/Invite';


import { createLog, loadLogs, selectOrderedLogs } from '../../../redux/entities/logs';
import { Item } from 'native-base';
import BadgeModal from '../../../lib/ui/modals/BadgeModel';
import { BadgeObj } from './../../volunteer_views/VolunteerHome/BadgeObject';
import API from '../../../api';
/*
 * Types
 */
type Props = {
}

/*
 * Styles
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
  justifyContent: space-between;`;

const onInvite = () => {
  return <Heading>invite</Heading>
}
/*
 * Component
 */
const AdminHome: FC<Props & NavigationInjectedProps> = ({ navigation }) => {
  const [visibleConfirmationModal, toggleInviteVisibility] = useToggle(false);
  const dispatch = useDispatch();
  const [logged, setLogged] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [visibleBadge, toggleBadgeVisibility] = useState(false);

  const logs = useSelector(selectOrderedLogs, shallowEqual);
  let hours = 0;
  let minutes = 0;
  Object.keys(logs).forEach(object => {
    for (let key in logs[object].duration) {
      if (key == 'hours') {
        hours += logs[object].duration[key];
      }
      if (key == 'minutes') {
        minutes += logs[object].duration[key];
      }
    }
  });

  hours = ~~(hours + minutes / 60);

  const avgDur = ~~(hours * 60 / logs.length);

  var volunteerNumberArray = new Set();
  Object.keys(logs).forEach(objectnum => {
    volunteerNumberArray.add(logs[objectnum].userId);
  })

  //access fail to send log and try logging them again
  const checkStorage = async () => {

    var logStore = await AsyncStorage.getItem('log cache');
    logStore = logStore == null ? [] : JSON.parse(logStore);
    var arr = Object.values(logStore);
    var newArray = [];

    var editlogStore = await AsyncStorage.getItem('edit log cache');
    editlogStore = editlogStore == null ? [] : JSON.parse(editlogStore);
    const editArr = Object.values(editlogStore);

    //return array of promise, assign a value null if succeed
    newArray = await Promise.all(arr.map(item => {
      const res = createLog(item)(dispatch).then((result) => {
        if (result.status == 200) {
          return null;
        } else {
          return item;
        };
      });
      return res;
    }));

    const newArrayEdit = await Promise.all(editArr.map(item => {
      const { userId, logId } = item;
      delete item.userId;
      delete item.logId;
      const res = updateLog(userId, logId, item)(dispatch).then((result) => {
        if (result.status == 200) {
          return null;
        } else {
          return item;
        };
      });
      return res;
    }));

    const correctedArray = newArray.filter(obj => {
      return obj != null;
    });

    const correctedArrayEdit = newArrayEdit.filter(obj => {
      return obj != null;
    });

    AsyncStorage.setItem(
      'log cache',
      JSON.stringify(correctedArray)
    );

    AsyncStorage.setItem(
      'edit log cache',
      JSON.stringify(correctedArrayEdit)
    );
  }

  useEffect(() => {
    checkStorage();
    dispatch(loadLogs());
  }, []);

  return (

    <View>
      <InvitationModal
        isVisible={visibleConfirmationModal}
        onCancel={toggleInviteVisibility}
        onSendClose={toggleInviteVisibility}
        awardBadge={toggleBadgeVisibility}
      />

      <BadgeModal
        visible={visibleBadge}
        badge={BadgeObj['InviteMedalBadge']}
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
          value={avgDur.toString()}
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
