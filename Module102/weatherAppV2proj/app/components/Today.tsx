import { Text, StyleSheet, View, FlatList } from 'react-native'
import React from 'react'
import { weatherDescriptions } from '../utils/weatherCodes';
import stringToTime from '../utils/stringToTime';

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

export default function Today({ location, weather }: CurrentlyProps) {

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

	if (!weather || !weather.hourly) {
		return (
			<View style={styles.container}>
				<Text style={styles.location}>{city ? city : "Edit location"}</Text>
				<Text style={styles.region}>{state || ""}</Text>
				<Text style={styles.country}>{country || ""}</Text>
				<Text style={{ fontSize: 20, color: 'red' }}>No datas</Text>
			</View>
		);
	}

	const hourlyData = weather.hourly;
	const timeArray = hourlyData.time;
	const temperatureArray = hourlyData.temperature_2m;
	const weatherCodeArray = hourlyData.weather_code;
	const windSpeedArray = hourlyData.wind_speed_10m;

	const DATA = timeArray.map((time: string, index: number) => ({
		formattedTime: stringToTime(time, 2), 
		temperature: temperatureArray[index],
		weatherCode: weatherDescriptions[weatherCodeArray[index]] || "Unknown",
		windSpeed: windSpeedArray[index],
	}));


	return (
		<View style={styles.container}>
			<Text style={styles.location}>{city ? city : "Edit location"}</Text>
			<Text style={styles.region}>{state || ""}</Text>
			<Text style={styles.country}>{country || ""}</Text>
			<FlatList
				data={DATA}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) =>
					<View style={styles.list}>
						<Text style={styles.time}>{item.formattedTime}</Text>
						<Text style={styles.temperature}>{item.temperature + "°C"}</Text>
						<Text style={styles.weatherDescription}>{item.weatherCode}</Text>
						<Text style={styles.windSpeed}>{item.windSpeed + " km/h"}</Text>
					</View>
				}
			/>
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
	list: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
		paddingVertical: 10,
		backgroundColor: 'pink',
		marginVertical: 2,
		height: 70,
		alignSelf: 'center',
	},
	time: {
		width: '20%',
    	textAlign: 'center',
	},
	temperature: {
		width: '20%',
    	textAlign: 'center'
	},
	weatherDescription: {
		width: '20%',
    	textAlign: 'center'
	},
	windSpeed: {
		width: '20%',
    	textAlign: 'center'
	},
});
