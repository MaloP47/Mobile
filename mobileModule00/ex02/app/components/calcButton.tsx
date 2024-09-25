import React from "react";
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function calcButton({ title, onPress, type = 'default'}) {

	const	buttonStyle = [
		styles.button,
		type === 'operator' && styles.operatorButton,
		type === 'equal' && styles.equalButton,
		type === 'clear' && styles.clearButton,
	];

	const	textStyle = [
		styles.buttonText,
		type === 'operator' && styles.operatorButtonText,
		type === 'equal' && styles.equalButtonText,
		type === 'clear' && styles.clearButtonText,
	];

	return (
		<TouchableOpacity
			style={buttonStyle}
			onPress={() => onPress(title)}
		>
			<Text style={textStyle}>{title}</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	button: {
	  flex: 1,
	  margin: 5,
	  backgroundColor: '#e0e0e0',
	  borderRadius: 10,
	  justifyContent: 'center',
	  alignItems: 'center',
	  height: 70,
	},
	buttonText: {
	  fontSize: 24,
	  color: '#000',
	},
	operatorButton: {
	  backgroundColor: '#f5923e',
	},
	operatorButtonText: {
	  color: '#fff',
	  fontWeight: 'bold',
	},
	equalButton: {
	  backgroundColor: '#4caf50',
	  flex: 2,
	},
	equalButtonText: {
	  color: '#fff',
	  fontWeight: 'bold',
	},
	clearButton: {
	  backgroundColor: '#d32f2f',
	},
	clearButtonText: {
	  color: '#fff',
	  fontWeight: 'bold',
	},
  });
