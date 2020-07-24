import React, { FC } from "react";
import styled from "styled-components/native";

import { Form as F } from "native-base";
import { NavigationInjectedProps } from "react-navigation";
import { AsyncStorage } from "react-native";
import { Forms } from "../../../lib/ui/forms/enums";
import LinkItem from "../../../lib/ui/forms/LinkItem";
import LinkPlay from "../../../lib/ui/forms/LinkPlay";
import Page from "../../../lib/ui/Page";
import Toggle from "../../../lib/ui/forms/Toggle";
import API from "../../../api";
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
/*
 * Component
 */

const Settings: FC<NavigationInjectedProps & Props> = ({ navigation }) => {
  const logOut = async () => {
    API.Authentication.logOut().catch(() => { });
    await AsyncStorage.clear();
    navigation.navigate("AuthStack");
  };
  return (
    <Page heading="Settings">
      <Form>
        <LinkItem
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <Toggle style={{ transform: [{ scaleX: .7 }, { scaleY: .7 }] }} label="Locations reminders" />


        <LinkItem
          title="Terms & Conditions"
          onPress={() => navigation.navigate("TnC")}
        />
        <LinkPlay title="Play 'How To' Again" onPress={() => { }} />
        <LinkItem title="Log Out" onPress={() => logOut()} />
      </Form>
    </Page>
  );
};

export default Settings;
