import React, { FC, useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import styled from "styled-components/native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { MaterialIcons } from "@expo/vector-icons";
import { withNavigation, NavigationInjectedProps } from "react-navigation";
import { CheckBox } from 'react-native-elements'
import SubmitButton from "../../../lib/ui/CardWithButtons/NotificationButton";
import { ColoursEnum } from "../../../lib/ui/colours";
import CardWithButtons from "../../../lib/ui/CardWithButtons";
import { FontsEnum, Heading2 as H2 } from "../../../lib/ui/typography";
import useToggle from "../../../lib/hooks/useToggle";
import {
  ButtonConfig,
  ButtonType,
} from "../../../lib/ui/CardWithButtons/types";
import { updateProject } from "../../../redux/entities/projects";
import {
  pushVolunteers,
  selectOrderedVolunteers,
} from '../../../redux/entities/volunteers';

/*
 * Types
 */
type Props = {
  id: number;
  title: string;
  date: string;
  deletedDate?: string;
  buttonType: ButtonType;
  onPress: () => void;
};

/*
 * Styles
 */
const InputHeading = styled.TextInput`
  marginLeft: 5;
  fontSize: 25;
  color: ${ColoursEnum.darkGrey};
  fontFamily: ${FontsEnum.light};
  letterSpacing: 1.2;
`;

const Heading2 = styled(H2)`
  marginLeft: 5;
`;

const HeadingContainer = styled.View`
  width: 100%;
  flexDirection: row;
  alignItems: flex-end;
  marginBottom: 5;
`;

const Description = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontSize: 15;
  paddingBottom: 5;
  marginLeft: 4;
`;

const getButtonConfig = (
  buttonType: ButtonType,
  active: boolean,
  buttonConfigs: ButtonConfig[]
) => {
  switch (buttonType) {
    case "restore":
      return buttonConfigs.find((x) => x.buttonType === "restore");
    case "archive":
    default:
      return active
        ? buttonConfigs.find((x) => x.buttonType === "save")
        : buttonConfigs.find((x) => x.buttonType === "archive");
  }
};

const getIconColor = (buttonType: ButtonType, active: boolean) => {
  switch (buttonType) {
    case "restore":
      return ColoursEnum.darkGrey;
    case "archive":
    default:
      return active ? ColoursEnum.purple : ColoursEnum.mustard;
  }
};

/*
 * Component
 */
const ProjectCard: FC<NavigationInjectedProps & Props> = ({
  date,
  title,
  buttonType,
  onPress,
  deletedDate,
  id,
}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(title);
  const [active, toggle] = useToggle(false);
  const iconColour = getIconColor(buttonType, active);

  // TODO: error message on save/edit error
  const onSave = () => {
    dispatch(updateProject(id, value));
    toggle();
  };

  // const projects = useSelector(selectAllOrderedProjects, shallowEqual);

  useEffect(() => {
    dispatch(pushVolunteers(id));
  }, []);

  const volunteers = useSelector(selectOrderedVolunteers, shallowEqual);


  const buttonConfigs: ButtonConfig[] = [
    {
      buttonType: "save",
      onSave,
    },
    {
      buttonType: "archive",
      onPress,
      onEdit: toggle,
    },
    {
      buttonType: "restore",
      onPress,
    },
  ];

  const [checked, setChecked] = useState(false);

  // push notification function to send push notification
  const sendPushNotification = async () => {
    const message = {
      to: 'ExponentPushToken[oHNi1tEeopXcwUFnrh0vx9]',
      sound: 'default',
      title: 'Reminder',
      body: 'Remember to log your hours!',
      data: { data: 'goes here' },
      _displayInForeground: true,
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  const onSubmit = async () => {
    console.log("I clicked the send button!");
    console.log(volunteers);
    sendPushNotification();
    Alert.alert(
      "Push Notification",
      "Push Notification Sent.",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
    // ToDo: use api to get all volunteers
    // get api endpoints
    // Knex: Select user_account_id from volunteer_hours_log WHERE volunteer_project_id = project_id;
    // ToDo: use api to get all volunteers in project 
  };

  return (
    <CardWithButtons
      buttonConfig={getButtonConfig(buttonType, active, buttonConfigs)}
    >
      <HeadingContainer>
        <MaterialIcons name="assignment" outline size={35} color={iconColour} />
        {active ? (
          <InputHeading
            selectTextOnFocus
            autoFocus
            onChangeText={setValue}
            value={value}
          />
        ) : (
            <Heading2>{value}</Heading2>
          )}
      </HeadingContainer>
      <Description>{`Created: ${date}`}</Description>
      <CheckBox
        title='Send Reminder to Log Hours.'
        checked={checked}
        onPress={() => setChecked(currentBool => !currentBool)}
      />
      <SubmitButton text="Send" onPress={(createTwoButtonAlert) => onSubmit()} />


      {deletedDate && <Description>{`Deleted: ${deletedDate}`}</Description>}
    </CardWithButtons>
  );
};

export default withNavigation(ProjectCard);
