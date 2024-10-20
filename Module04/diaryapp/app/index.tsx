import React, { useRef, useEffect } from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated } from 'react-native';

export default function HomeScreen() {

	const scaleAnimation = useRef(new Animated.Value(1)).current;
	const colorAnimation = useRef(new Animated.Value(0)).current;
	const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
  
	useEffect(() => {
	  // Animation pour l'effet heartbeat
	  Animated.loop(
		Animated.sequence([
		  Animated.timing(scaleAnimation, {
			toValue: 1.1, // Augmente légèrement la taille
			duration: 300, // Durée pour le battement vers l'extérieur
			useNativeDriver: true,
		  }),
		  Animated.timing(scaleAnimation, {
			toValue: 1, // Retourne à la taille normale
			duration: 300, // Durée pour le retour
			useNativeDriver: true,
		  }),
		])
	  ).start();
  
	  // Animation de changement de couleur
	  Animated.loop(
		Animated.sequence([
		  Animated.timing(colorAnimation, {
			toValue: 1,
			duration: 800, // Changement vers un jaune plus foncé
			useNativeDriver: false,
		  }),
		  Animated.timing(colorAnimation, {
			toValue: 0,
			duration: 800, // Retour à un jaune plus clair
			useNativeDriver: false,
		  }),
		])
	  ).start();
	}, [scaleAnimation, colorAnimation]);
  
	const backgroundColor = colorAnimation.interpolate({
	  inputRange: [0, 1],
	  outputRange: ['#FFD700', '#FFA500'], // Différentes nuances de jaune
	});

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