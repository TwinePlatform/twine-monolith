import React, {FC} from 'react';
import styled from 'styled-components/native';
import SupportButton from './SupportButton';
import SettingsButton from "./SettingsButton";

type Props = {
}

const ButtonContainer = styled.View`
    flex: 1;
    flex-direction: row;
`;

const HeaderButtons: FC<Props> = (props) => (
    <ButtonContainer>
        <SupportButton/>
        <SettingsButton/>
    </ButtonContainer>
)

export default HeaderButtons;