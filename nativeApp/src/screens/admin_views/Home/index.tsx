import React, { FC } from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { Heading as H } from '../../../lib/ui/typography';
import { ColoursEnum } from '../../../lib/ui/colours';
import useToggle from '../../../lib/hooks/useToggle';
import InvitationModal from '../../../lib/ui/modals/InvitationModal';
import Stat from '../../../lib/ui/Stat';
import Line from '../../../lib/ui/Line';
import Invite from '../../../lib/ui/Invite';

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

const onInvite = () =>{
  console.log("invite pressed");
  return <Heading>invite</Heading>
}
/*
 * Component
 */
const AdminHome: FC<Props> = () => {
  const [visibleConfirmationModal, toggleInviteVisibility] = useToggle(false);

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
        <Invite onPress={toggleInviteVisibility} organisation={"aperture science"}/>
    </View>
  );
}


export default AdminHome;
