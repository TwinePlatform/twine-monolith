import styled from 'styled-components/native';
import { ColoursEnum } from './colours';

/*
 * Styles
 */
const Line = styled.View`
  alignSelf: center;
  width: 85%;
  borderBottomWidth: 1;
  borderColor: ${ColoursEnum.grey};
`;

export default Line;
