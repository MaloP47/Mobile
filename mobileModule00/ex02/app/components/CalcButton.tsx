import { Dimensions, StyleSheet, Text, TouchableOpacity } from "react-native";

import { FC } from "react";

interface CalcButtonProps {
	onPress: (text: string) => void;
	text: string;
	theme?: "secondary" | "operator" | "default";
	disabled?: boolean;
}

const CalcButton: FC<CalcButtonProps> = ({ onPress, text, theme, disabled = false }) => {
	const buttonStyles = [styles.button];
	const textStyles = [styles.text];

	if (theme === "secondary") {
		textStyles.push(styles.textSecondary);
	} else if (theme === "operator") {
		textStyles.push(styles.textOperator);
	}

	return (
		<TouchableOpacity disabled={disabled} onPress={!disabled ? () => onPress(text) : null} style={buttonStyles}>
			<Text style={textStyles}>{text}</Text>
		</TouchableOpacity>
	)
};

const screen = Dimensions.get("window");
const buttonWidth = screen.width / 4;

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#a5a2a2",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "black",
		fontSize: 24,
	},
	textSecondary: {
		color: "red",
	},
	textOperator: {
        color: "white",
    },
});

export default CalcButton;
