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
    options: { id: number; name: string }[];
    onValueChange: any;
    defaultValue?: string | number;
    name?: string;
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
const Dropdown: FC<Props> = (props) => {
    const {
        label, options, onValueChange, defaultValue, name, ...rest
    } = props;
    const [value, setValue] = useState(defaultValue);
    return (
        <Item picker>
            <Label>{label}</Label>
            <Picker
                mode="dropdown"
                iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
                placeholder="Select"
                placeholderStyle={{ color: ColoursEnum.grey }}
                placeholderIconColor={ColoursEnum.grey}
                selectedValue={value}
                onValueChange={(val) => {
                    onValueChange(val);
                    setValue(val);
                }}
                {...rest}
            >
                {options.map(({ id, name }) => (
                    <Picker.Item label={name} value={name} key={id} />
                ))}

            </Picker>
        </Item>
    );
};

export default Dropdown;