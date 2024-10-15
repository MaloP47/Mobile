import { Text, StyleSheet, View, FlatList } from 'react-native';
import React from 'react';
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
	location?: Location | null | undefined | City;
	weather?: any;
}

export default function Weekly({ location, weather }: CurrentlyProps) {

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

	if (!weather || !weather.daily) {
		return (
			<View style={styles.container}>
				<Text style={styles.location}>{city ? city : "Edit location"}</Text>
				<Text style={styles.region}>{state || ""}</Text>
				<Text style={styles.country}>{country || ""}</Text>
				<Text style={{ fontSize: 20, color: 'red' }}>No datas</Text>
			</View>
		);
	}

	const dailyData = weather.daily;
	const timeArray = dailyData.time;
	const temperatureMaxArray = dailyData.temperature_2m_max;
	const temperatureMinArray = dailyData.temperature_2m_min;
	const weatherCodeArray = dailyData.weather_code;

	const DATA = timeArray.map((time: string, index: number) => ({
		time, 
		temperatureMax: temperatureMaxArray[index],
		temperatureMin: temperatureMinArray[index],
		weatherCode: weatherDescriptions[weatherCodeArray[index]] || "Unknown",
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
						<Text style={styles.date}>{item.time}</Text>
						<Text style={styles.min}>{item.temperatureMin + "°C"}</Text>
						<Text style={styles.max}>{item.temperatureMax + "°C"}</Text>
						<Text style={styles.weatherDescription}>{item.weatherCode}</Text>
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
		width: "95%",
		backgroundColor: 'pink',
		paddingVertical: 10,
		alignSelf: 'center',
		height: 70,
		marginVertical: 3,
	},
	date: {
		width: '25%',
    	textAlign: 'center',
	},
	min: {
		width: '25%',
    	textAlign: 'center'
	},
	weatherDescription: {
		width: '25%',
    	textAlign: 'center'
	},
	max: {
		width: '25%',
    	textAlign: 'center'
	},
});
