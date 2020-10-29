import React, { FC, useState } from "react";
import styled from "styled-components/native";

import { Form as F } from "native-base";
import { NavigationInjectedProps } from "react-navigation";
import { AsyncStorage } from "react-native";
import { Forms } from "../../../lib/ui/forms/enums";
import LinkItem from "../../../lib/ui/forms/LinkItem";
import LinkPlay from "../../../lib/ui/forms/LinkPlay";
import Page from "../../../lib/ui/Page";
import LogOutModal from "../../../lib/ui/modals/logout";
import API from "../../../api";

// import HelpSlidesModal from '../../../lib/ui/HelpSlides/content';
import useToggle from '../../../lib/hooks/useToggle';

/*
 * Types
 */
type Props = {};

/*
 * Styles
 */
const Form = styled(F)`
  width: ${Forms.formWidth};
`;

const fullpage = styled.View`

`;
/*
 * Component
 */

const Settings: FC<NavigationInjectedProps & Props> = ({ navigation }) => {
  const logOut = async () => {
    logOutModalVisible();
  };

  const [logOutVisible, logOutModalVisible] = useToggle(false);

  const onConfirm = () => {
    API.Authentication.logOut().catch(() => { });
    // await AsyncStorage.clear();
    navigation.navigate("AuthStack");
  }

  const onCancel = () => {
    logOutModalVisible();
  }

  return (

    <Page heading="Settings">
      {/* <HelpSlidesModal 
      isVisible = {modalVisible}
      /> */}

      <LogOutModal
        isVisible={logOutVisible}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <Form>
        <LinkItem
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />

        <LinkItem
          title="Terms & Conditions"
          onPress={() => navigation.navigate("TnC")}
        />
        <LinkPlay title="Play 'How To' Again" onPress={() => navigation.navigate("HelpSlideStack")} />
        <LinkItem title="Log Out" onPress={() => logOut()} />
      </Form>
    </Page>


  );
};

export default Settings;
