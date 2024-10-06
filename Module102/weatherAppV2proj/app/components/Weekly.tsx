import { Text, StyleSheet, View, FlatList } from 'react-native'
import React from 'react'

interface CurrentlyProps {
  searchText?: string;
}

const TTWS = [
	{ date: '2024-01-01', min: '5°C', max: '15°C', weather: 'Sunny' },
	{ date: '2024-01-01', min: '6°C', max: '16°C', weather: 'Cloudy' },
	{ date: '2024-01-01', min: '8°C', max: '18°C', weather: 'Rainy' },
	{ date: '2024-01-01', min: '10°C', max: '20°C', weather: 'Sunny' },
	{ date: '2024-01-01', min: '12°C', max: '22°C', weather: 'Partly Cloudy' },
];

export default function Weekly({ searchText }: CurrentlyProps) { // Change prop
	return (
		<View style={styles.container}>
			<Text style={styles.location}>Paris</Text>
			<Text style={styles.region}>Ile de France</Text>
			<Text style={styles.country}>France</Text>
			<FlatList
				data={TTWS} // Change that
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
		paddingVertical: 20,
		alignSelf: 'center',
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
