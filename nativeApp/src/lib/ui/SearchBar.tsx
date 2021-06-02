import React, { FC } from 'react';
import { View, TextInput } from 'react-native';
import { ColoursEnum } from './colours';
import { FontsEnum } from './typography';

export const SearchBar = (props) => {
    const {onChangeText,placeholder} = props;

    return (
        <View
        style={{
            width: '100%',
            paddingLeft: 30,
            paddingRight: 10,
            alignItems: 'flex-end'
        }}
        >
            <TextInput
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={{
                width: '100%', 
                backgroundColor: ColoursEnum.white, 
                fontFamily: FontsEnum.regular,
                color: ColoursEnum.purple,
                fontSize: 16,
            }}
            >
            </TextInput>
        </View>
    )
        
}