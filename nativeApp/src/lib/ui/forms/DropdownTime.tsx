import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I, Picker, Label as L } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';


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

    console.log(value)

    return (
        <Item picker>
            <Label>{label}</Label>
            <Picker
                mode="dropdown"
                iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
                placeholder="Select"
                placeholderStyle={{ color: ColoursEnum.grey }}
                placeholderIconColor={ColoursEnum.grey}
                //selectedValue={value}
                value={value}
                onValueChange={(val) => {
                    onValueChange(val);
                    setValue(val);
                }}
                {...rest}
            >
                {options.map(time => (
                    <Picker.Item label={''+time} value={time} key={time} />
                ))}

            </Picker>
        </Item>
    );
};

export default DropdownTime;