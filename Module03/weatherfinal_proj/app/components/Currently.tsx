import { Text, StyleSheet, View } from 'react-native'
import React from 'react'
import { weatherDescriptions } from '../utils/weatherCodes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
			<View style={styles.locationBlock}>
				<Text style={styles.location}>{city ? city : "Edit location"}</Text>
				<Text style={styles.region}>{state || ""}</Text>
				<Text style={styles.country}>{country || ""}</Text>
			</View>
			<View style={styles.tempBlock}>
				<Text style={styles.temperature}>{temperature + "°C"|| ""}</Text>
			</View>
			<View style={styles.weatherBlock}>
				<MaterialCommunityIcons name="weather-cloudy" size={100} color="grey" />
				<Text style={styles.weatherDescription}>{weatherDescription || ""}</Text>
			</View>
			<View style={styles.windBlock}>
				<Text style={styles.windSpeed}>{<MaterialCommunityIcons name="weather-windy" size={20} color="turquoise" />} {windSpeed + " km/h"|| ""}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: 'column',
	},
	location: {
		fontSize: 36,
		color: "blue",
		textAlign: 'center',
	},
	region: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	country: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	temperature: {
		fontSize: 40,
		color: "orange",
		textAlign: 'center',
	},
	weatherDescription: {
		fontSize: 24,
		color: 'white',
		textAlign: 'center',
	},
	windSpeed: {
		fontSize: 24,
		color: 'white',
		textAlign: 'center',
	},
	locationBlock: {
		// backgroundColor: 'yellow',
		flex: 3,
	},
	tempBlock: {
		// backgroundColor: 'yellow',
		flex: 1,
	},
	weatherBlock: {
		// backgroundColor: 'yellow',
		flex: 3,
	},
	windBlock: {
		// backgroundColor: 'yellow',
		flex: 3,
	},
});
