import { View, Text, StyleSheet } from "react-native";

export default function SignIn():JSX.Element {
	return (
		<View style={styles.container}>
			<Text style={styles.textStyle}>Sign in</Text>
		</View>
	);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 32,
        fontFamily: 'Pacifico'
    },
});
