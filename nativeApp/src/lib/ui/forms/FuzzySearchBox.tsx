import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I, Picker, Label as L, Input } from 'native-base';
import {FlatList as F, Text as T} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

import Fuse from 'fuse.js';
/*
 * Types
 */
type Props = {
  ref: (ref: unknown) => void;
  label: string;
  options: {id: number; name: string}[];
  onValueChange: any;
  defaultValue?: string | number;
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

const Text = styled(T)`
  fontSize: 17px;
`;

const FlatList = styled(F)`
  marginLeft: ${Forms.labelWidth};
`;

const filterData = (data,filter) => {
  if(filter === "")
    return data;
  const options = {
    keys: [
      "name"
    ]
  };
  const fuse = new Fuse(data, options);
  let output = [];
  fuse.search(filter).map(item => output.push(item.item));
  return output.length < 5 ? output : output.slice(0,5);
}

/*
 * Component
 */
const FuzzySearchBox: FC<Props> = (props) => {
  const {
    label, options, onValueChange, defaultValue, ...rest
  } = props;
  const [text, setText] = useState("");
  const [textInputFocus, setTextInputFocus] = useState(false);
  const [filteredData, setFilteredData] = useState(options);

  const changeText = (text :string) => {
    setText(text);
    setFilteredData(filterData(options,text));
  }

  const renderRow = (item) => {
    return  <TouchableNativeFeedback
                onPress={() => {
                  setText(item.name);
                  onValueChange(item.name);
                  }
                }
            >
                <Text>{item.name}</Text>
            </TouchableNativeFeedback>
  }

  return (
    <React.Fragment>
      <Item picker>
      <Label>{label}</Label>
        <Input placeholder="Search volunteers"
              placeholderTextColor={ ColoursEnum.grey}
              onChangeText={text=>changeText(text)}
              onFocus={() => setTextInputFocus(true)}
              onBlur={() => setTextInputFocus(false)}
              value={text}
        />
    </Item>
    {textInputFocus && 
    <FlatList
          data={filteredData}
          renderItem={({item}) => renderRow(item)}
          keyExtractor={item => item.id.toString()}
        />
    }    
    </React.Fragment>
    
  );
};

export default FuzzySearchBox;