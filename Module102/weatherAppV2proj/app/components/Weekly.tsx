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
	{ date: '2024-01-01', min: '5°C', max: '15°C', weather: 'Sunny' },
	{ date: '2024-01-02', min: '6°C', max: '16°C', weather: 'Cloudy' },
	{ date: '2024-01-03', min: '8°C', max: '18°C', weather: 'Rainy' },
	{ date: '2024-01-04', min: '10°C', max: '20°C', weather: 'Sunny' },
	{ date: '2024-01-05', min: '12°C', max: '22°C', weather: 'Partly Cloudy' },
];

export default function Weekly({ location }: CurrentlyProps) {

	if (location === undefined) {
		return (
			<View style={styles.container}>
				<Text style={{fontSize:40, color:"red"}}>Fuck</Text>
			</View>
		);
	}

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
			<FlatList // Need to change the way list is displayed
				data={TTWS} // Change props
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) =>
					<View style={styles.list}>
						<Text style={styles.date}>{item.date}</Text>
						<Text style={styles.min}>{item.min}</Text>
						<Text style={styles.max}>{item.max}</Text>
						<Text style={styles.weatherDescription}>{item.weather}</Text>
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
