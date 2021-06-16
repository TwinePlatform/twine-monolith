import React, { FC, useState } from 'react';
import styled from 'styled-components/native';
import { Item as I,
	 Picker as P 
	} from 'native-base';
//import {Picker as P} from '@react-native-community/picker';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Forms } from './enums';
import { ColoursEnum } from '../colours';
import { View as V } from 'react-native';


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

	const [value, setValue] = useState();
	return (
		<Item picker>
			{
				/*
				<Picker
				mode="dropdown"
				// iosIcon={<MaterialIcons name="keyboard-arrow-down" />}
				//iosIcon={<AntDesign style={{ fontSize: 10 }} name="caretdown" />}
				placeholder="ORGANISATION"
				// textStyle={{ color: ColoursEnum.grey }}
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
				*/
			}
			
		</Item >
	);
};

export default DropdownShort;
