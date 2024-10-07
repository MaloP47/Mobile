import { Text, StyleSheet, View } from 'react-native'
import React from 'react'

interface Address {
	city?: string;
	state?: string;
	country?: string;
	town?: string;
}

interface CurrentlyProps {
	location?: {
		address?: Address;
	};
}

export default function Currently({ location }: CurrentlyProps) {

	let city = location?.address?.city;
	const state = location?.address?.state;
	const country = location?.address?.country;

	if (!city) {
		city = location?.address?.town;
	}

	return (
		<View style={styles.container}>
			<Text style={styles.location}>{city ? city : "Edit location"}</Text>
			<Text style={styles.region}>{state || ""}</Text>
			<Text style={styles.country}>{country || ""}</Text>
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
