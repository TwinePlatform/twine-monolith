import React, { FC } from 'react';
import { ColorDotsLoader } from 'react-native-indicator';

import { ColoursEnum } from './colours';


/*
 * Types
 */
type Props = {
  isVisible: boolean;
}

/*
 * Styles
 */

/*
 * Component
 */
const Loader: FC<Props> = ({ isVisible }) => (isVisible
  ? (
    <ColorDotsLoader
      color1={ColoursEnum.purple}
      color2={ColoursEnum.mustard}
      color3={ColoursEnum.grey}
      size={20}
    />
  )
  : <></>);

export default Loader;
