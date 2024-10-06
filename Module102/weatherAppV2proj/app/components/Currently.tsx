import { Text, StyleSheet, View } from 'react-native'
import React from 'react'

interface CurrentlyProps {
  searchText?: string;
}

export default function Currently({ searchText }: CurrentlyProps) {
	return (
		<View style={styles.container}>
			<Text style={styles.location}>Paris</Text>
			<Text style={styles.region}>Ile de France</Text>
			<Text style={styles.country}>France</Text>
			<Text style={styles.temperature}>21°C</Text>
			<Text style={styles.weatherDescription}>Sunny</Text>
			<Text style={styles.windSpeed}>30km/h</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	},
	location: {
		fontSize: 32,
		textAlign: 'center',
	},
	region: {

	},
	country: {

	},
	temperature: {

	},
	weatherDescription: {

	},
	windSpeed: {

	},
});
