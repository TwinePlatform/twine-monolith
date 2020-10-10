import React, { FC } from 'react';
import styled from 'styled-components/native';
import {
  Tabs as _Tabs, Tab as T,
} from 'native-base';
import { ColoursEnum } from './colours';


/*
 * Types
 */
type Props = {
  tabOne: [string, FC<{}>, {}];
  tabTwo: [string, FC<{}>, {}];
  onSwitch?: any;
}

/*
 * Styles
 */
const Tab = styled(T)`
  marginTop: 10;
`;

/*
 * Component
 */
const Tabs: FC<Props> = (props) => {
  const {
    tabOne: [headingOne, ComponentOne, propsOne],
    tabTwo: [headingTwo, ComponentTwo, propsTwo],
    onSwitch
  } = props;

  

  return (
    <_Tabs
      tabContainerStyle={{ height: 40 }} //eslint-disable-line
      tabBarUnderlineStyle={{ backgroundColor: ColoursEnum.purple }}
      onChangeTab={()=>{
        if(onSwitch)
          onSwitch();
        }}
    >
      <Tab
        heading={headingOne}
        tabStyle={{ backgroundColor: ColoursEnum.white }}
        textStyle={{ color: ColoursEnum.darkGrey }}
        activeTextStyle={{ color: ColoursEnum.purple }}
        activeTabStyle={{ borderColor: ColoursEnum.purple, backgroundColor: ColoursEnum.white }}
      >
        <ComponentOne {...propsOne} />
      </Tab>
      <Tab
        heading={headingTwo}
        textStyle={{ color: ColoursEnum.darkGrey }}
        tabStyle={{ backgroundColor: ColoursEnum.white }}
        activeTextStyle={{ color: ColoursEnum.purple }}
        activeTabStyle={{ borderColor: ColoursEnum.purple, backgroundColor: ColoursEnum.white }}
      >
        <ComponentTwo {...propsTwo} />
      </Tab>
    </_Tabs>
  );
};

export default Tabs;
