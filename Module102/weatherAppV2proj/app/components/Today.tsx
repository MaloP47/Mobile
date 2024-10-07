import { Text, StyleSheet, View, FlatList } from 'react-native'
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

const TTWS = [
	{ time: '08:00', temperature: '15°C', weather: 'Sunny', windSpeed: '5 km/h' },
	{ time: '09:00', temperature: '16°C', weather: 'Cloudy', windSpeed: '10 km/h' },
	{ time: '10:00', temperature: '18°C', weather: 'Rainy', windSpeed: '12 km/h' },
	{ time: '11:00', temperature: '20°C', weather: 'Sunny', windSpeed: '8 km/h' },
	{ time: '12:00', temperature: '22°C', weather: 'Partly Cloudy', windSpeed: '6 km/h' },
];

export default function Today({ location }: CurrentlyProps) {

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
			<FlatList
				data={TTWS} // Change that
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) =>
					<View style={styles.list}>
						<Text style={styles.time}>{item.time}</Text>
						<Text style={styles.temperature}>{item.temperature}</Text>
						<Text style={styles.weatherDescription}>{item.weather}</Text>
						<Text style={styles.windSpeed}>{item.windSpeed}</Text>
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
		justifyContent: "space-between",
		alignItems: "center",
		width: "95%",
		paddingVertical: 10,
		backgroundColor: 'pink',
		marginVertical: 2,
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
