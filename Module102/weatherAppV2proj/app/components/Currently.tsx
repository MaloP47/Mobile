import { Text, StyleSheet, View } from 'react-native'
import React from 'react'
import { weatherDescriptions } from '../utils/weatherCodes';

interface Address {
	city?: string;
	state?: string;
	country?: string;
	town?: string;
}

interface LocationFormat1 {
	address: Address;
}

interface LocationFormat2 {
	name?: string;
	admin1?: string;
	country?: string;
}

type Location = LocationFormat1 | LocationFormat2;

interface CurrentlyProps {
	location?: Location | null | undefined | City;
	weather?: any;
}

export default function Currently({ location, weather }: CurrentlyProps) {

	if (location === undefined || typeof location !== 'object') {
		return (
			<View style={styles.container}>
				<Text style={{fontSize:40, color:"red"}}>Problem with location</Text>
			</View>
		);
	}

	const getLocationDetails = (location: Location | undefined) => {
		let city: string | undefined;
		let state: string | undefined;
		let country: string | undefined;
	
		if (location && typeof location === 'object') {
			if ('address' in location && location.address) {
				city = location.address.city || location.address.town;
				state = location.address.state;
				country = location.address.country;
			} else {
				city = 'name' in location ? location.name : undefined;
				state = 'admin1' in location ? location.admin1 : undefined;
				country = 'country' in location ? location.country : undefined;
			}
		} else {
			city = undefined;
			state = undefined;
			country = undefined;
		}
	
		return { city, state, country };
	};

	const { city, state, country } = getLocationDetails(location);

	let temperature, weatherDescription, windSpeed;
	if (weather && weather.current ) {
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
