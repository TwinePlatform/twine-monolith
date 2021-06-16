import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I} from 'native-base';
import {Picker as P} from '@react-native-community/picker';

/*
 * Types
 */
type Props = {
  ref?: (ref: unknown) => void;
  options: { id: number; name: string }[];
  onValueChange: any;
  defaultValue?: string | number;
  placeholder?: string;
}

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: flex-start;	
  marginLeft: 0;	
  paddingLeft:0;
  width:80%;	
  justifyContent: space-between;	
  flexDirection: row;	
`;

const Picker = styled(P)`
  width: 100%;
  height: 35px;
  paddingLeft: 0;
  marginRight: 0;
`;

/*
 * Component
 */
const DropdownNoLabel: FC<Props> = (props) => {
  const { options, onValueChange, defaultValue, placeholder, ...rest
  } = props;

  const [value, setValue] = useState(defaultValue);

  return (
    <Item picker>
        <Picker
            selectedValue={value}
            style={{color: value===""? 'lightgrey' : 'black'}}
            onValueChange={val => {	
				  	    onValueChange(val);
					      setValue(val);
				    }}
        >
            <Picker.Item label={placeholder} value={""} key={"place"}/>
            {options.map(({ id, name }) => (
                <Picker.Item label={name} value={name} key={id} />
            ))}
        </Picker>
    </Item >
  );
};

export default DropdownNoLabel;
