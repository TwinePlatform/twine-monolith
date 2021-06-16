import React, {FC, useEffect, useState} from 'react';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {NavigationInjectedProps } from 'react-navigation';
import API from '../../../api';
import {loadLogs} from '../../../redux/entities/logs';
import {registerForPushNotificationsAsync} from '../../../lib/utils/pushNotifications';
import {attemptToEmptyLogCache} from '../../../lib/utils/cache';
import useToggle from '../../../lib/hooks/useToggle';
import Tabs from '../../../lib/ui/Tabs';
import Page from '../../../lib/ui/Page';
import AddBar from '../../../lib/ui/AddBar';
import InvitationModal from '../../../lib/ui/modals/InvitationModal';
import Invite from '../../../lib/ui/Invite';
import BadgeModal from '../../../lib/ui/modals/BadgeModel';
import {BadgeObj} from '../../../lib/ui/Badges/BadgeObject';
import {StatsTab} from '../../../lib/ui/StatsTab';
import {BadgesTab} from '../../../lib/ui/BadgesTab';

/*
 * Types
 */
type Props = {
}

/*
 * Component
 */

const VolunteerHome: FC<Props & NavigationInjectedProps> = ({ navigation }) => {
  const [visibleInvitationModal, toggleInviteVisibility] = useToggle(false);
  const [visibleBadge, toggleBadgeVisibility] = useState(false);
  const dispatch = useDispatch();
  const [badgeArray, setBadgeArray] = useState([]);

  const getBadges = async () => {
    console.log('getting own badges in frontend');
    setBadgeArray(await API.Badges.getBadges());
  }

  useEffect(() => {
    attemptToEmptyLogCache(dispatch);
    registerForPushNotificationsAsync();
    AsyncStorage.getItem('HelpSlides').then(hasDisplayedBefore => {
      if (!hasDisplayedBefore) {
        navigation.navigate('HelpSlideStack');
      }
    })
    getBadges();
    dispatch(loadLogs());
  }, []);

  return (
    <View>
    <Page heading="Home" withAddBar>
     <InvitationModal
        isVisible={visibleInvitationModal}
        onCancel={toggleInviteVisibility}
        onSendClose={toggleInviteVisibility}
        awardBadge={toggleBadgeVisibility}
        title={"Invite Volunteers By Email"}
      />
      <BadgeModal
        visible={visibleBadge}
        badge={BadgeObj['InviteMedalBadge']}
      />
      <AddBar onPress={() => navigation.navigate('VolunteersBadges')} title="Volunteer's Badges" />
      <Tabs
        tabOne={['Stats', StatsTab,{}]}
        tabTwo={['Badges', BadgesTab, { badge: badgeArray }]}
        onSwitch={()=>{getBadges()}}
      />
    </Page>
    <Invite onPress={toggleInviteVisibility}/>
    </View>
  );
}
export default VolunteerHome;