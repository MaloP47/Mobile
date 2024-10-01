import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function exZero() {

	const [isLandscape, setIsLandscape] = useState(false);

	useEffect(() => {

		ScreenOrientation.unlockAsync();
	
		const getInitialOrientation = async () => {
		  const orientation = await ScreenOrientation.getOrientationAsync();
		  if (
			orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
			orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
		  ) {
			setIsLandscape(true);
		  } else {
			setIsLandscape(false);
		  }
		};
	
		getInitialOrientation();
	
		const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
		  const orientation = event.orientationInfo.orientation;
		  if (
			orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
			orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
		  ) {
			setIsLandscape(true);
		  } else {
			setIsLandscape(false);
		  }
		});
	
		return () => {
		  ScreenOrientation.removeOrientationChangeListener(subscription);
		};
	  }, []);

	return (
		<View className='flex-1 justify-center items-center bg-white'>
		<Text className='text-3xl bg-lime-800/75 rounded-lg'>A simple text</Text>
		<TouchableOpacity
			className='bg-white py-2 px-4 rounded-full shadow-2xl mt-2'
			style={styles.shadow}
			onPress={() => console.log('Button pressed')}
			>
			<Text className='text-lime-800/50 rounded-full'>Click me</Text>
		</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "#000000",
		shadowOffset: {
			width: 0,
			height: 18,
		},
		shadowOpacity:  0.25,
		shadowRadius: 20.00,
		elevation: 12,
	}
})