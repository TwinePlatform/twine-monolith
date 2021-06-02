import React, { FC } from 'react';
import styled from 'styled-components/native';
import {useSelector, useDispatch, shallowEqual } from 'react-redux';
import {openModal, closeModal, selectModalStatus} from '../../redux/entities/support';



/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */

const Clickable = styled.TouchableOpacity`
  paddingLeft: 10;
  paddingRight: 10;
`;

const Icon = styled.Image`
    height: 25;
    width: 25;
`;
/*
 * Component
 */
const SupportButton: FC<Props> = (props) => {
    const dispatch = useDispatch();
    const {modalOpen} = useSelector(selectModalStatus,shallowEqual);
    
    const handlePress = () => {
        if(modalOpen)
            dispatch(closeModal());
        else
            dispatch(openModal());
    }
    
    return(
        <Clickable onPress={() => {handlePress()}}>
            <Icon source={require('../../../assets/images/support_icon.png')} />
        </Clickable>
)};

export default SupportButton;
