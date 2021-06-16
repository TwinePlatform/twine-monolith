import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I} from 'native-base';
import {Picker as P} from '@react-native-community/picker';

/*
 * Types
 */
type Props = {
	options: { id: number; name: string }[];
	onValueChange: any;
	defaultValue?: string | number;
}

/*
 * Styles
 */
const Item = styled(I)`
  alignItems: center;	
  textAlign: center;
  justifyContent: space-between;	
  flexDirection: row;	
`;

const Picker = styled(P)`
	alignItems: center;
	textAlign:center;
  width: 150px;
`;

/*
 * Component
 */
const DropdownShort: FC<Props> = (props) => {
	const { options, onValueChange, defaultValue, ...rest
	} = props;

	const [value, setValue] = useState(defaultValue);

	return (
		<Item picker>
			<Picker
                selectedValue={value}
                style={{height: 50, width: 200}}
                onValueChange={val => {	
					onValueChange(val);
					setValue(val);
				}}
            >
                {options.map(({ id, name }) => (
                    <Picker.Item label={name} value={name} key={id} />
                ))}
            </Picker>
		</Item >
	);
};

export default DropdownShort;
