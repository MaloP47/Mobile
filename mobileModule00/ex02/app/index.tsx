import React, { useState, useEffect } from "react";
import {SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Appbar } from 'react-native-paper';
import CalcButton from "./components/CalcButton";
import Row from "./components/Row";
import * as ScreenOrientation from 'expo-screen-orientation';

export default function index() {

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

		if (buttonValue === "C" || input.length > 20) {
		  setInput('')
		} else {
		  setInput(input + buttonValue)
		}
	};

	return (
		<View style={styles.container}>
			<Appbar.Header style={styles.appBar}>
				<Appbar.Content title="Calculator" titleStyle={styles.appBarTitle} />
			</Appbar.Header>
			<View style={styles.numPad}>
				<Text style={styles.result}>0</Text>
				<Text style={styles.input}>{input || '0'}</Text>

				<Row>
					<CalcButton text="7" onPress={handleClick} />
					<CalcButton text="8" onPress={handleClick} />
					<CalcButton text="9" onPress={handleClick} />
					<CalcButton text="C" onPress={handleClick} theme="secondary" />
					<CalcButton text="AC" onPress={handleClick} />
				</Row>
				<Row>
					<CalcButton text="4" onPress={handleClick} />
					<CalcButton text="5" onPress={handleClick} />
					<CalcButton text="6" onPress={handleClick} />
					<CalcButton text="+" onPress={handleClick} />
					<CalcButton text="-" onPress={handleClick} />
				</Row>
				<Row>
					<CalcButton text="1" onPress={handleClick} />
					<CalcButton text="2" onPress={handleClick} />
					<CalcButton text="3" onPress={handleClick} />
					<CalcButton text="*" onPress={handleClick} />
					<CalcButton text="/" onPress={handleClick} />
				</Row>
				<Row>
					<CalcButton text="0" onPress={handleClick} />
					<CalcButton text="." onPress={handleClick} />
					<CalcButton text="00" onPress={handleClick} />
					<CalcButton text="=" onPress={handleClick} />
					<CalcButton text=" " onPress={handleClick} />
				</Row>
			</View>
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: "#202020",
	},
	input: {
	  color: "#fff",
	  fontSize: 42,
	  textAlign: "right",
	  marginRight: 20,
	  marginBottom: 10,
	},
	result: {
		color: "#fff",
		fontSize: 42,
		textAlign: "right",
		marginRight: 20,
		marginBottom: 10,
	  },
	appBar: {
		// flex: 1,
		backgroundColor: "yellow"
	},
	appBarTitle: {
		textDecorationColor: "white",
		backgroundColor: "blue",
	},
	numPad:{
		flex: 1,
		justifyContent: 'flex-end',
	}
  });
