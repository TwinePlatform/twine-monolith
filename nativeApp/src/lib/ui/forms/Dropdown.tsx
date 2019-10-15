import React, { FC, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components/native';
import { Item as I, Picker, Label as L } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
  label: string;
  options: {id: number; name: string}[];
  selectedValue: string;
  onValueChange: Dispatch<SetStateAction<string>>;
  defaultValue?: string;
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
    label, options, selectedValue, onValueChange, defaultValue,
  } = props;
  return (
    <Item picker>
      <Label>{label}</Label>
      <Picker
        mode="dropdown"
        iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
        placeholder="Select"
        placeholderStyle={{ color: ColoursEnum.grey }}
        placeholderIconColor={ColoursEnum.grey}
        selectedValue={selectedValue || defaultValue}
        onValueChange={onValueChange}
      >
        {options.map(({ id, name }) => (
          <Picker.Item label={name} value={name} key={id} />
        ))}

      </Picker>
    </Item>
  );
};

export default Dropdown;
