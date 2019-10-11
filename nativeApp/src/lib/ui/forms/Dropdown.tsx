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
  inline: boolean;
  label: string;
  options: {id: number; name: string}[];
  selectedValue: string;
  onValueChange: Dispatch<SetStateAction<string>>;
}

/*
 * Styles
 */
const Item = styled(I)<{inline: boolean}>`
  alignItems: ${({ inline }) => (inline ? 'center' : 'flex-start')};
  marginLeft: 0;
  marginTop:  ${({ inline }) => (inline ? '0' : '5')}
  width:100%;
  justifyContent: space-between;
  flexDirection: ${({ inline }) => (inline ? 'row' : 'column')};
`;

const Label = styled(L) < { inline: boolean }>`
 ${({ inline }) => (inline && `width: ${Forms.labelWidth}`)};
`;

/*
 * Component
 */
const Dropdown: FC<Props> = (props) => {
  const {
    label, options, selectedValue, onValueChange, inline,
  } = props;
  return (
    <Item picker inline={inline}>
      <Label inline={inline}>{label}</Label>
      <Picker
        mode="dropdown"
        iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
        placeholder="Select"
        placeholderStyle={{ color: ColoursEnum.grey }}
        placeholderIconColor={ColoursEnum.grey}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {options.map(({ id, name }) => (
          <Picker.Item label={name} value={id} key={id} />
        ))}

      </Picker>
    </Item>
  );
};

export default Dropdown;
