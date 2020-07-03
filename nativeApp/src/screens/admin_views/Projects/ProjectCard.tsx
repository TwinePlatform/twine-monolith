import React, { FC, useState, useEffect } from "react";
import styled from "styled-components/native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { MaterialIcons } from "@expo/vector-icons";
import { withNavigation, NavigationInjectedProps } from "react-navigation";
import { CheckBox } from "react-native-elements";
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
  loadVolunteers,
  selectOrderedVolunteers,
} from "../../../redux/entities/volunteers";

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
  marginleft: 5;
  fontsize: 25;
  color: ${ColoursEnum.darkGrey};
  fontfamily: ${FontsEnum.light};
  letterspacing: 1.2;
`;

const Heading2 = styled(H2)`
  marginleft: 5;
`;

const HeadingContainer = styled.View`
  width: 100%;
  flexdirection: row;
  alignitems: flex-end;
  marginbottom: 5;
`;

const Description = styled.Text`
  color: ${ColoursEnum.darkGrey};
  fontsize: 15;
  paddingbottom: 5;
  marginleft: 4;
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
    dispatch(pushVolunteers());
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

  const onSubmit = async () => {
    console.log("I clicked the send button!");
    console.log(volunteers);
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
      {deletedDate && <Description>{`Deleted: ${deletedDate}`}</Description>}
    </CardWithButtons>
  );
};

export default withNavigation(ProjectCard);
