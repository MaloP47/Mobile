import React, { useState, useEffect } from "react";
import {SafeAreaView, StyleSheet, Text, View, Platform } from "react-native";
import CalcButton from "./components/CalcButton";
import Row from "./components/Row";
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from "expo-status-bar";

export default function Calculator() {

	const [input, setInput] = useState('');
	const [isLandscape, setIsLandscape] = useState(false);
	const [result, setResult] = useState('');

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

	const handleClick = (buttonValue: string) => {
		console.log("button pressed : " + buttonValue);
	  
		if (buttonValue === "AC" || input.length > 12) {
		  setInput('');
		  setResult('');
		} else if (buttonValue === "C") {
		  setInput(input.slice(0, -1));
		} else if (buttonValue === "=") {
		  setResult('');
		  try {
			const evalResult = eval(input);
			if (evalResult === Infinity || evalResult === -Infinity) {
			  setResult('Division par 0');
			} else {
			  setResult(evalResult.toString());
			}
		  } catch (error) {
			setResult('Wrong format');
		  }
		} else {
		  if (buttonValue === '.') {
			// Gestion du point décimal
			const tokens = input.split(/[\+\-\*\/]/);
			const lastToken = tokens[tokens.length - 1];
			if (lastToken.includes('.')) {
			  // Le dernier nombre contient déjà un point
			  return;
			} else {
			  setInput(input + buttonValue);
			}
		  } else if (buttonValue === '-') {
			// Gestion du signe moins pour les nombres négatifs ou l'opérateur de soustraction
			const lastChar = input[input.length - 1];
			if (input === '' || ['+', '-', '*', '/'].includes(lastChar)) {
			  // Permettre '-' après un opérateur ou au début pour indiquer un nombre négatif
			  setInput(input + buttonValue);
			} else {
			  setInput(input + buttonValue);
			}
		  } else if (['+', '*', '/'].includes(buttonValue)) {
			// Gestion des autres opérateurs
			const lastChar = input[input.length - 1];
			if (['+', '-', '*', '/'].includes(lastChar)) {
			  // Remplacer le dernier opérateur par le nouveau
			  setInput(input.slice(0, -1) + buttonValue);
			} else {
			  setInput(input + buttonValue);
			}
		  } else {
			// Gestion des chiffres
			setInput(input + buttonValue);
		  }
		}
	  };
	  

	return (		
		<View style={styles.container}>
			<StatusBar
				style={'light'}
				backgroundColor={'#444141'}
				hidden={false}
				></StatusBar>
			<View className="flex-2 justify-center bg-[#a5a2a2] h-[50]">
				<Text className="text-center text-white font-bold text-3xl">Calculator</Text>
			</View>
			<View className="flex-1 bg-[#444141]">
				<Text style={styles.input}>{input || '0'}</Text>
				<Text style={styles.result}>{result || '0'}</Text>
			</View>
				<View className="flex-1 justify-end">
					<Row>
						<CalcButton text="7" onPress={handleClick} theme="default" />
						<CalcButton text="8" onPress={handleClick} theme="default" />
						<CalcButton text="9" onPress={handleClick} theme="default" />
						<CalcButton text="C" onPress={handleClick} theme="secondary" />
						<CalcButton text="AC" onPress={handleClick} theme="secondary" />
					</Row>
					<Row>
						<CalcButton text="4" onPress={handleClick} theme="default" />
						<CalcButton text="5" onPress={handleClick} theme="default" />
						<CalcButton text="6" onPress={handleClick} theme="default" />
						<CalcButton text="+" onPress={handleClick} theme="operator" />
						<CalcButton text="-" onPress={handleClick} theme="operator" />
					</Row>
					<Row>
						<CalcButton text="1" onPress={handleClick} theme="default" />
						<CalcButton text="2" onPress={handleClick} theme="default" />
						<CalcButton text="3" onPress={handleClick} theme="default" />
						<CalcButton text="*" onPress={handleClick} theme="operator" />
						<CalcButton text="/" onPress={handleClick} theme="operator"/>
					</Row>
					<Row>
						<CalcButton text="0" onPress={handleClick} theme="default" />
						<CalcButton text="." onPress={handleClick} theme="default" />
						<CalcButton text="00" onPress={handleClick} theme="default" />
						<CalcButton text="=" onPress={handleClick} theme="operator" />
						<CalcButton text=" " disabled={true} theme="default" onPress={() => {}} />
					</Row>
				</View>
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
		fontSize: 50,
		textAlign: "right",
		marginRight: 10,
		// marginBottom: 10,
	},
	input: {
		color: "#fff",
		fontSize: 50,
		textAlign: "right",
		marginRight: 10,
		marginBottom: 10,
	},
});

{/* <reference types="nativewind/types" /> */}
