import { Text, StyleSheet, View } from 'react-native'
import React from 'react'
import { weatherDescriptions } from '../utils/weatherCodes';

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
	weather?: any;
}

export default function Currently({ location, weather }: CurrentlyProps) {

	if (location === undefined) {
		return (
			<View style={styles.container}>
				<Text style={{fontSize:40, color:"red"}}>Problem with location</Text>
			</View>
		);
	}
	
	let city = location?.address?.city;
	const state = location?.address?.state;
	const country = location?.address?.country;

	if (!city) {
		city = location?.address?.town;
	}

	let temperature, weatherDescription, windSpeed;
	if (weather && weather.current && (weather.latitude == 0 && weather.longitude == 0)) {
		temperature = weather.current.temperature_2m;
		const code = weather.current.weather_code;
  		weatherDescription = weatherDescriptions[code] || 'Unknown';
		windSpeed = weather.current.wind_speed_10m;
	} else {
		return (
			<View style={styles.container}>
				<Text style={styles.location}>{city ? city : "Edit location"}</Text>
				<Text style={styles.region}>{state || ""}</Text>
				<Text style={styles.country}>{country || ""}</Text>
				<Text style={{ fontSize: 20, color: 'red' }}>No datas</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.location}>{city ? city : "Edit location"}</Text>
			<Text style={styles.region}>{state || ""}</Text>
			<Text style={styles.country}>{country || ""}</Text>
			<Text style={styles.temperature}>{temperature + "°C"|| ""}</Text>
			<Text style={styles.weatherDescription}>{weatherDescription || ""}</Text>
			<Text style={styles.windSpeed}>{windSpeed + " km/h"|| ""}</Text>
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
		fontSize: 36,
		textAlign: 'center',
	},
	region: {
		fontSize: 20,
		textAlign: 'center',
	},
	country: {
		fontSize: 20,
		textAlign: 'center',
	},
	temperature: {
		fontSize: 24,
		textAlign: 'center',
	},
	weatherDescription: {
		fontSize: 24,
		textAlign: 'center',
	},
	windSpeed: {
		fontSize: 24,
		textAlign: 'center',
	},
});
