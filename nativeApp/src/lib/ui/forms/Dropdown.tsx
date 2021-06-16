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
    options: { id: number; name: string }[];
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
const MyPicker = styled.Picker`
`;*/



/*	
 * Component	
 */
const Dropdown: FC<Props> = (props) => {
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
                onValueChange={itemValue =>{
                    setValue(itemValue);
                    onValueChange(itemValue);
                }}
            >
                {options.map(({ id, name }) => (
                    <Picker.Item label={name} value={name} key={id} />
                ))}
            </Picker>
        </Item>
    );
};

export default Dropdown;