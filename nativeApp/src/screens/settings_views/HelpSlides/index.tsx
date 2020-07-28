import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';
import { Form as F } from 'native-base';
import { Text, View, ImageBackground, StyleSheet } from "react-native";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NavigationInjectedProps } from 'react-navigation';

import HelpSlidesTemplate from '../../../lib/ui/HelpSlides/content';
import HelpSlidesStart from '../../../lib/ui/HelpSlides/first';
import HelpSlidesEnd from '../../../lib/ui/HelpSlides/last';

/*
 * Types
 */
type Props = {
}

/*
 * Styles
 */


/*
 * Component
 */
export const slide1: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

	return (
		<View>
			<HelpSlidesStart
				navigation={navigation}
			/>
		</View>
	)
};

export const slide2: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

	return (
		<View>
			<HelpSlidesTemplate
				navigation={navigation}
				rightNavigation='slide3'
				leftNavigation='slide1'
				backgroundname='slide2'
				imagename='addTime'
				text='Add your hours..'
			/>
		</View>
	)
};

export const slide3: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

	return (
		<View>
			<HelpSlidesTemplate
				navigation={navigation}
				backgroundname='slide3'
				rightNavigation='slide4'
				leftNavigation='slide2'
				imagename='addTimedetails'
				text='Fill in the details..'
			/>
		</View>
	)
};

export const slide4: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

	return (
		<View>
			<HelpSlidesTemplate
				navigation={navigation}
				backgroundname='slide4'
				rightNavigation='slide5'
				leftNavigation='slide3'
				imagename='addTimedetails'
				text='Submit your time..'
			/>
		</View>
	)
};

export const slide5: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

	return (
		<View>
			<HelpSlidesTemplate
				navigation={navigation}
				backgroundname='slide5'
				rightNavigation='slide6'
				leftNavigation='slide4'
				imagename='editTime'
				text='Edit your logs if you need to..'
			/>
		</View>
	)
};

export const slide6: FC<Props & NavigationInjectedProps> = ({ navigation }) => {

	return (
		<View>
			<HelpSlidesEnd
				navigation={navigation}
			/>
		</View>
	)
};

