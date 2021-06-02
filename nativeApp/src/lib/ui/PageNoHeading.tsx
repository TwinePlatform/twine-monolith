import React, { FC } from 'react';
import styled from 'styled-components/native';
import {useSelector, useDispatch, shallowEqual } from 'react-redux';
import {closeModal, selectModalStatus} from '../../redux/entities/support';
import SupportModal from './modals/SupportModal';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const Scrollable = styled.ScrollView`
`;

const View = styled.View`
`;

/*
 * Component
 */
const PageNoHeading: FC<Props> = ({children}) => {
  const dispatch = useDispatch();
  const {modalOpen} = useSelector(selectModalStatus,shallowEqual);

  return (
  <Scrollable
    keyboardShouldPersistTaps={'handled'}
  >
    <View>
      <SupportModal isVisible={modalOpen} closeFunction={()=>dispatch(closeModal())}/>
      {children}
    </View>
  </Scrollable>
)};

export default PageNoHeading;
