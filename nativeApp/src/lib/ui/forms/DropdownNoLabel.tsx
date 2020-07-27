import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I, Picker as P } from 'native-base';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';


/*
 * Types
 */
type Props = {
  ref: (ref: unknown) => void;
  options: { id: number; name: string }[];
  onValueChange: any;
  defaultValue?: string | number;
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
  width: 300px;
  paddingLeft: 0;
  marginRight: 0;
`;

/*
 * Component
 */
const DropdownNoLabel: FC<Props> = (props) => {
  const { options, onValueChange, defaultValue, ...rest
  } = props;

  const [value, setValue] = useState();
  return (
    <Item picker>
      <Picker
        mode="dropdown"
        // iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
        iosIcon={<AntDesign style={{ fontSize: 10 }} name="caretdown" />}
        placeholder="ORANISATION"
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
    </Item >
  );
};

export default DropdownNoLabel;
