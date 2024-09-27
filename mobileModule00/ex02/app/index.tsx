import React, { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import CalcButton from "./components/CalcButton";
import Row from "./components/Row";

export default function index() {

	const [input, setInput] = useState('');

	const handleClick = (buttonValue) => {
		console.log("button pressed : " + buttonValue);

		if (buttonValue === "C" || input.length > 10) {
		  setInput('')
		} else {
		  setInput(input + buttonValue)
		}
	};

	return (
		<View style={styles.container}>
			<SafeAreaView>
				<Text style={styles.result}>0</Text>
				<Text style={styles.input}>{input || '0'}</Text>

				<Row>
					<CalcButton text="7" onPress={handleClick} />
					<CalcButton text="8" onPress={handleClick} />
					<CalcButton text="9" onPress={handleClick} />
					<CalcButton text="C" onPress={handleClick} />
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
			</SafeAreaView>
		</View>
	)
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: "#202020",
	  justifyContent: "flex-end",
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
  });