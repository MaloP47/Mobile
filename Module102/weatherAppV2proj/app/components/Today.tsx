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
	location?: Location;
	weather?: any;
}
export default function Today({ location, weather }: CurrentlyProps) {

	if (location === undefined|| typeof location !== 'object') {
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

	if (!weather || !weather.hourly || (weather.latitude != 0 && weather.longitude != 0)) {
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
