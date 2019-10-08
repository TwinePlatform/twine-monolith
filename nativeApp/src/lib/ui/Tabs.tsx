import React, { FC } from 'react';
// import styled from 'styled-components/native';
import {
  Tabs as _Tabs, Tab,
} from 'native-base';
import { ColoursEnum } from './colours';


/*
 * Types
 */
type Props = {
  tabOne: [string, FC<{}>];
  tabTwo: [string, FC<{}>];
}

/*
 * Styles
 */

/*
 * Component
 */
const Tabs: FC<Props> = (props) => {
  const {
    tabOne: [headingOne, ComponentOne],
    tabTwo: [headingTwo, ComponentTwo],
  } = props;
  return (
    <_Tabs tabBarUnderlineStyle={{ backgroundColor: ColoursEnum.purple }}>
      <Tab
        activeTextStyle={{ color: ColoursEnum.purple }}
        heading={headingOne}
        activeTabStyle={{ borderColor: ColoursEnum.purple }}
      >
        <ComponentOne />
      </Tab>
      <Tab
        activeTextStyle={{ color: ColoursEnum.purple }}
        heading={headingTwo}
        activeTabStyle={{ borderColor: ColoursEnum.purple }}
      >
        <ComponentTwo />
      </Tab>
    </_Tabs>
  );
};

export default Tabs;
