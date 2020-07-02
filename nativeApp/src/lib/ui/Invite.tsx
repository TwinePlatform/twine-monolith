import React, { FC } from "react";
import styled from "styled-components/native";
import { ColoursEnum } from "./colours";
import { FontsEnum } from "./typography";
import { Button as B } from 'native-base';

const InviteText = styled.Text`
  color: ${ColoursEnum.white};
  fontSize: 20;
  font-family: ${FontsEnum.medium};
`;

const InviteButton = styled(B)`
  width: 30%;
  borderRadius: 15;
  backgroundColor: ${ColoursEnum.purple};
  alignItems: center;
  justifyContent: center;
  marginTop: 20;
  marginBottom: 30;
  position: absolute;
  bottom: 0;
  right: 5%;
`;

type Props = {
  organisation: string;
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
