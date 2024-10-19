import {View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function HomeScreen() {
	return (
		<ImageBackground resizeMode="cover" source={require('@/assets/images/golden.png')} style={styles.imgBg} >
			<View style={styles.central}>
				<Text style={styles.textOne}>Welcome to your</Text>
				<Text style={styles.textTwo}>Diary</Text>
				<View style={styles.buttonZone}>
					<TouchableOpacity style={styles.loginButtonGoogle}>
						<Text style={styles.buttonTxt}><SimpleLineIcons name="social-google" size={35} color="black" /></Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.loginButtonGithub}>
						<Text style={styles.buttonTxt}><SimpleLineIcons name="social-github" size={35} color="black" /></Text>
					</TouchableOpacity>
				</View>
			</View>
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	imgBg: {
		flex: 1,
	},
	central: { //?? Need to space a bit things
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		alignContent: "space-between",
		// backgroundColor: "blue",
	},
	textOne: {
		color: "blue",
		fontSize: 36,
		fontFamily: "Pacifico",
		backgroundColor: "orange",
	},
	textTwo: {
		color: "red",
		fontSize: 36,
		fontFamily: "Pacifico",
		backgroundColor: "yellow",
	},
	buttonZone: {
		backgroundColor: "green",
		flexDirection: "row",
	},
	loginButtonGoogle: {
		backgroundColor: "pink",
		marginHorizontal: 15,
	},
	loginButtonGithub: {
		backgroundColor: "pink",
		marginHorizontal: 15,
	},
	buttonTxt: {
		color: "green",
		fontSize: 36,
		fontFamily: "",
	},
});
