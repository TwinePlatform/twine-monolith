import React, { FC } from "react";
import {Dimensions} from 'react-native';
import styled from "styled-components/native";
import { ColoursEnum } from "./colours";
import { FontsEnum } from "./typography";
import { Button as B } from 'native-base';

const InviteText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 20;
  font-family: ${FontsEnum.medium};
`;

const distanceFromTop = Dimensions.get('window').height * 0.60;

const InviteButton = styled(B)`
  width: 30%;
  borderRadius: 15;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  marginBottom: 30;
  position: absolute;
  top: ${distanceFromTop};
  right: 5%;
`;

type Props = {
  onPress: () => void;
};

const Invite: FC<Props> = (props) => {
  return <InviteButton
  onPress={props.onPress}
>
  <InviteText>Invite</InviteText>
</InviteButton>;
};

export default Invite;
