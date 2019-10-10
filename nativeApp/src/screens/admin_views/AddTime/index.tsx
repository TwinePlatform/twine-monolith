import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Heading } from '../../../lib/ui/typography';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */
const View = styled.View`
alignItems: center;
paddingTop: 20;
paddingBottom: 20;
`;

/*
 * Component
 */
const AddTime: FC<Props> = (props) => (
  <View>
    <Heading>Add Time</Heading>
  </View>
);

AddTime.navigationOptions = {
  title: 'Add Time',
};
export default AddTime;
