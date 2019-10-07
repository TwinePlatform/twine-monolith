import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Item as I, Picker, Label as L } from 'native-base';
import { TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
  label: string;
  options: {id: number; name: string}[];
  selectedValue?: string;
  onValueChange?: () => void;
} & TextInputProps

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;
  marginLeft: 0;
  width:100%;
  justifyContent: space-between;
`;

const Label = styled(L)`
 width: ${Forms.labelWidth};
`;

/*
 * Component
 */
const Dropdown: FC<Props> = (props) => {
  const {
    label, options, selectedValue, onValueChange, ...rest
  } = props;
  return (
    <Item picker inlineLabel>
      <Label>{label}</Label>
      <Picker
        mode="dropdown"
        iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
        style={{ width: undefined }}
        placeholder="Select"
        placeholderStyle={{ color: ColoursEnum.grey }}
        placeholderIconColor="#007aff"
        selectedValue={selectedValue}
        onValueChange={() => {}}
      >
        {options.map(({ id, name }) => (
          <Picker.Item label={name} value={id} key={id} />
        ))}

      </Picker>
    </Item>
  );
};

export default Dropdown;
