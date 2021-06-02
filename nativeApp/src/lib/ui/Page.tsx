import React, { FC } from 'react';
import styled from 'styled-components/native';
import {useSelector, useDispatch, shallowEqual } from 'react-redux';
import {closeModal, selectModalStatus} from '../../redux/entities/support';
import SupportModal from './modals/SupportModal';
import { Heading as H } from './typography';

/*
 * Types
 */
type Props = {
  heading: string;
  withAddBar?: boolean;
}

/*
 * Styles
 */
const Scrollable = styled.ScrollView`
`;

const Heading = styled(H)<{withAddBar: boolean}>`
  marginBottom: ${({ withAddBar }) => (withAddBar ? '10' : '20')}
`;

const View = styled.View`
  alignItems: center;
  paddingTop: 20;
  paddingBottom: 20;
`;

/*
 * Component
 */
const Page: FC<Props> = ({ heading, children, withAddBar }) => {
  const dispatch = useDispatch();
  const {modalOpen} = useSelector(selectModalStatus,shallowEqual);

  return (
  <Scrollable
    keyboardShouldPersistTaps={'handled'}
  >
    <View>
      <Heading withAddBar={withAddBar}>{heading}</Heading>
      <SupportModal isVisible={modalOpen} closeFunction={()=>dispatch(closeModal())}/>
      {children}
    </View>
  </Scrollable>
)};

export default Page;
