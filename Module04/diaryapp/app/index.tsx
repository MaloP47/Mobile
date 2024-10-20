import React from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated } from 'react-native';
import { useButtonAnimation } from '../hooks/useButtonAnimation';

export default function HomeScreen() {

	const { AnimatedTouchableOpacity, backgroundColor, scaleAnimation } = useButtonAnimation();

	return (
		<ImageBackground resizeMode="cover" source={require('@/assets/images/golden.png')} style={styles.imgBg} >
			<View style={styles.central}>
				<Text style={styles.textOne}>Welcome To Your</Text>
				<Text style={styles.textTwo}>Diary</Text>
				<View style={styles.buttonZone}>
					<AnimatedTouchableOpacity style={[styles.buttonLogin, {backgroundColor}]} onPress={() => console.log("Login")}>
						<Text style={styles.buttonTxt}>Login</Text>
					</AnimatedTouchableOpacity>
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
		color: "black",
		fontSize: 40,
		fontFamily: "Pacifico",
		// backgroundColor: "orange",
	},
	textTwo: {
		color: "black",
		fontSize: 40,
		fontFamily: "Pacifico",
		// backgroundColor: "yellow",
	},
	buttonZone: {
		// backgroundColor: "green",
		
	},
	loginButtonGoogle: {
		// backgroundColor: "pink",
		marginHorizontal: 15,
	},
	loginButtonGithub: {
		// backgroundColor: "pink",
		marginHorizontal: 15,
	},
	buttonTxt: {
		color: "black",
		fontSize: 26,
		fontFamily: "Pacifico",
		textAlign: 'center',
		lineHeight: 40,
	},
	buttonLogin: {
		backgroundColor: '#FFD700',
		borderRadius: 25,
		paddingVertical: 10,
		paddingHorizontal: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 25,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 15
	},
	buttonLoginView: {
		flexDirection: 'row', // Aligner le texte si tu ajoutes des icônes par ex
		justifyContent: 'center',
		alignItems: 'center',
	},
});

import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

{/* <TouchableOpacity style={styles.loginButtonGoogle}>
	<Text style={styles.buttonTxt}><SimpleLineIcons
										name="social-google"
										size={35}
										color="black"
										onPress={() => console.log("Google")}
									/></Text>
</TouchableOpacity>
<TouchableOpacity style={styles.loginButtonGithub}>
	<Text style={styles.buttonTxt}><SimpleLineIcons
										name="social-github"
										size={35}
										color="black"
										onPress={() => console.log("Github")}
									/></Text>
</TouchableOpacity> */}