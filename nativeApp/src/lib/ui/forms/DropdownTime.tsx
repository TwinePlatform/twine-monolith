import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I, Label as L } from 'native-base';
import {Picker} from '@react-native-community/picker';
import { Forms } from './enums';

/*	
 * Types	
 */
type Props = {
    ref?: (ref: unknown) => void;
    label: string;
    options: number[];
    onValueChange: any;
    defaultValue?: string | number;
    name?: string;
    selectedValue?: any;
    value?: any;
    onBlur?: any;
}

/*	
 * Styles	
 */
const Item = styled(I)`	
  alignItems: center;	
  marginLeft: 0;	
  width:100%;	
  justifyContent: space-between;	
  flexDirection: row;	
`;

const Label = styled(L)`	
  width: ${Forms.labelWidth};	
`;

/*	
 * Component	
 */

const DropdownTime: FC<Props> = (props) => {
    const {
        label, options, onValueChange, defaultValue, name, ...rest
    } = props;

    const [value, setValue] = useState(defaultValue);

    return (
        <Item picker>
            <Label>{label}</Label>
            <Picker
                selectedValue={value}
                style={{height: 50, width: 200}}
                onValueChange={itemValue => {
                    onValueChange(itemValue)
                    setValue(itemValue)
                }}
            >
                {options.map(time => (
                    <Picker.Item label={''+time} value={time} key={time} />
                ))}
            </Picker>
        </Item>
    );
};

export default DropdownTime;