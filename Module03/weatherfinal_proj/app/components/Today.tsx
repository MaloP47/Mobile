import { Text, StyleSheet, View, FlatList, Dimensions, ScrollView } from 'react-native'
import React from 'react'
import { weatherDescriptions } from '../utils/weatherCodes';
import stringToTime from '../utils/stringToTime';
import { LineChart } from "react-native-chart-kit";
import { weatherIcons } from '../utils/weatherIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTemperatureColor, getWindSpeedColor, getWeatherIconColor } from '../utils/dynamicCSS';

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
		weatherDescription: weatherDescriptions[weatherCodeArray[index]] || "Unknown",
		windSpeed: windSpeedArray[index],
		weatherCode: weatherCodeArray[index],
		iconName: weatherIcons[weatherCodeArray[index]] || "weather-sunny-off",
	}));

	const labels = DATA.map((item: { formattedTime: string }) => item.formattedTime);
	const data = DATA.map((item: { formattedTime: string; temperature: number; weatherCode: string; windSpeed: number }) => item.temperature);

	const adjustedLabels = labels.map((label: string, index: number) => {
		if (index % 2 === 0) {
			return label;
		} else {
			return "";
		}
	});

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
			<View style={styles.container}>
				<View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
					<Text style={styles.location}>{city ? city : "Edit location"}</Text>
					<Text style={styles.region}>{state || ""}</Text>
					<Text style={styles.country}>{country || ""}</Text>
				</View>
				<View style={{flex: 1}}>
					<Text style={{color: 'orange', textAlign: 'center'}}>Hourly temperatures</Text>
					<LineChart
						data={{
						labels: adjustedLabels,
						datasets: [
							{
								data: data
							}
						]
						}}
						width={Dimensions.get("window").width} // from react-native
						height={220}
						// yAxisLabel="$"
						yAxisSuffix="°C"
						yAxisInterval={1} // optional, defaults to 1
						chartConfig={{
						backgroundColor: "#e26a00",
						backgroundGradientFrom: "#fb8c00",
						backgroundGradientTo: "#ffa726",
						decimalPlaces: 1, // optional, defaults to 2dp
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16
						},
						propsForDots: {
							r: "6",
							strokeWidth: "2",
							stroke: "#ffa726"
						}
						}}
						bezier
						style={{
						marginVertical: 8,
						borderRadius: 16
						}}
					/>
				</View>
				<FlatList
					data={DATA}
					keyExtractor={(item, index) => index.toString()}
					horizontal={true}
					showsHorizontalScrollIndicator={true}
					renderItem={({ item }) =>
						<View style={styles.list}>
							<Text style={styles.time}>{item.formattedTime}</Text>
							<MaterialCommunityIcons name={item.iconName} size={50} color={getWeatherIconColor(item.weatherCode)} />
							<Text style={[styles.temperature, { color: getTemperatureColor(item.temperature) }]}>{item.temperature + "°C"|| ""}</Text>
							<Text style={[styles.windSpeed, { color: getWindSpeedColor(item.windSpeed) }]}>{<MaterialCommunityIcons name="weather-windy" size={10} color="turquoise" />} {item.windSpeed + " km/h"|| ""}</Text>

						</View>
					}
				/>
			</View>
		</ScrollView>
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
		color: 'white',
		textAlign: 'center',
	},
	region: {
		color: 'white',
	},
	country: {
		color: 'white',
	},
	list: {
		width: 100, // Ajustez la largeur selon vos besoins
		height: 100, // Ajustez la hauteur selon vos besoins
  		justifyContent: 'center',
  		alignItems: 'center',
  		// backgroundColor: 'pink',
  		marginHorizontal: 5, // Ajoute de l'espace entre les éléments
	},
	time: {
		// width: '20%',
    	textAlign: 'center',
		color: "white",
	},
	temperature: {
		// width: '20%',
    	textAlign: 'center'
	},
	weatherDescription: {
		// width: '20%',
    	textAlign: 'center'
	},
	windSpeed: {
		// width: '20%',
    	textAlign: 'center'
	},
});
