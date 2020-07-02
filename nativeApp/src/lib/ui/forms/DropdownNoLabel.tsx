import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I, Picker, } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
  ref: (ref: unknown) => void;
  options: {id: number; name: string}[];
  onValueChange: any;
  defaultValue?: string | number;
}

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  width:100%;
  justifyContent: space-between;
  flexDirection: row;
`;

/*
 * Component
 */
const DropdownNoLabel: FC<Props> = (props) => {
  const { options, onValueChange, defaultValue, ...rest
  } = props;
  const [value, setValue] = useState(defaultValue);
  return (
    <Item picker>
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

export default DropdownNoLabel;
