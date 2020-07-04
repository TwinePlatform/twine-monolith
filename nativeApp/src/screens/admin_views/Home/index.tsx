import React, { FC, useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import useToggle from '../../../lib/hooks/useToggle';
import InvitationModal from '../../../lib/ui/modals/InvitationModal';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';
import Invite from '../../../lib/ui/Invite';

import { createLog, createLogReset } from '../../../redux/entities/logs';

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
  const [logged, setLogged] = useState(false);

  //access fail to send log and try logging them again
  const checkStorage = async () => {
    var logStore = await AsyncStorage.getItem('log cache');
    logStore = logStore == null ? [] : JSON.parse(logStore);
    var arr = Object.values(logStore);
    var newArray = [];

    //return array of promise, assign a value null if succeed
    newArray = await Promise.all(arr.map(item => {
      const res = createLog(item)(dispatch).then((result) => {
        if (result.status == 200) {
          return null;
        } else {
          return result;
        };
      });
      return res;

    }));

    console.log(newArray);

    const correctedArray = newArray.filter(obj => {
      console.log(obj);
      console.log(obj != null);
      return obj != null;
    });

    console.log(correctedArray);


    AsyncStorage.setItem(
      'log cache',
      JSON.stringify(correctedArray)
    );


  }

  useEffect(() => {
    checkStorage();
  }, []);



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
          value="6"
          unit="people"
        >
          <MaterialIcons name="person-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="TOTAL TIME GIVEN"
          value="109"
          unit="hours"
        >
          <MaterialCommunityIcons name="clock-outline" outline size={35} color={ColoursEnum.mustard} />
        </Stat>
        <Line />
        <Stat
          heading="AVERAGE DURATION"
          value="120"
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
