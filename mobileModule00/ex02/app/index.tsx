import React, { useState, useEffect } from "react";
import {SafeAreaView, StyleSheet, Text, View, Platform } from "react-native";
import CalcButton from "./components/CalcButton";
import Row from "./components/Row";
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from "expo-status-bar";

export default function Calculator() {

	const [input, setInput] = useState('');
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

	const handleClick = (buttonValue) => {
		console.log("button pressed : " + buttonValue);

		if (buttonValue === "C" || input.length > 12) {
		  setInput('')
		} else {
		  setInput(input + buttonValue)
		}

	};

	return (
		<View style={styles.container}>
			<View className="flex-3 bg-[#a5a2a2]">
				<Text className="text-center text-white font-bold text-2xl">Calculator</Text>
			</View>
			<View className="flex-2 bg-[#444141]">
				<Text style={styles.result}>0</Text>
				<Text style={styles.input}>{input || '0'}</Text>
			</View>
				<View className="flex-1 justify-end">
					<Row>
						<CalcButton text="7" onPress={handleClick} />
						<CalcButton text="8" onPress={handleClick} />
						<CalcButton text="9" onPress={handleClick} />
						<CalcButton text="C" onPress={handleClick} theme="secondary" />
						<CalcButton text="AC" onPress={handleClick} theme="secondary" />
					</Row>
					<Row>
						<CalcButton text="4" onPress={handleClick} />
						<CalcButton text="5" onPress={handleClick} />
						<CalcButton text="6" onPress={handleClick} />
						<CalcButton text="+" onPress={handleClick} theme="operator" />
						<CalcButton text="-" onPress={handleClick} theme="operator" />
					</Row>
					<Row>
						<CalcButton text="1" onPress={handleClick} />
						<CalcButton text="2" onPress={handleClick} />
						<CalcButton text="3" onPress={handleClick} />
						<CalcButton text="*" onPress={handleClick} theme="operator" />
						<CalcButton text="/" onPress={handleClick} theme="operator"/>
					</Row>
					<Row>
						<CalcButton text="0" onPress={handleClick} />
						<CalcButton text="." onPress={handleClick} />
						<CalcButton text="00" onPress={handleClick} />
						<CalcButton text="=" onPress={handleClick} theme="operator" />
						<CalcButton text=" " disabled={true} />
					</Row>
				</View>
			<StatusBar
				style={Platform.OS === 'ios' ? 'dark' : 'light'}
				backgroundColor={Platform.OS === 'ios' ? '#fff' : '#444141'}
				hidden={false}
				/>
			<StatusBar
				style={Platform.OS === 'ios' ? 'dark' : 'light'}
				backgroundColor={Platform.OS === 'ios' ? '#fff' : '#444141'}
				hidden={false}
				/>
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#444141",
	},
	result: {
		color: "#fff",
		fontSize: 42,
		textAlign: "right",
		marginRight: 10,
		marginBottom: 10,
	},
	input: {
		color: "#fff",
		fontSize: 42,
		textAlign: "right",
		marginRight: 10,
		marginBottom: 10,
	},
});
