import { Text, StyleSheet, View, FlatList, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { weatherDescriptions } from '../utils/weatherCodes';
import { LineChart } from "react-native-chart-kit";
import { weatherIcons } from '../utils/weatherIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { getTemperatureColor, getWeatherIconColor } from '../utils/dynamicCSS';
import Entypo from '@expo/vector-icons/Entypo';

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
		<Text style={{ fontSize: 20, color: 'red' }}>No data</Text>
	  </View>
	);
  }

	const dailyData = weather.daily;
	const timeArray = dailyData.time;
	const temperatureMaxArray = dailyData.temperature_2m_max;
	const temperatureMinArray = dailyData.temperature_2m_min;
	const weatherCodeArray = dailyData.weather_code;

  const DATA = timeArray.map((time: string, index: number) => {
	const date = new Date(time);
	const formattedTime = date.toLocaleDateString('fr-FR',{ day: '2-digit', month: '2-digit' });
	const temperatureMax = temperatureMaxArray[index];
	const temperatureMin = temperatureMinArray[index];
	const weatherCode = weatherCodeArray[index];
	const weatherDescription = weatherDescriptions[weatherCode] || "Unknown";
	const temperature = (temperatureMax + temperatureMin) / 2;
	return {
		time, 
		formattedTime,
		temperatureMax,
		temperatureMin,
		temperature,
		weatherCode, // Code numérique
		weatherDescription, // Description textuelle
		iconName: weatherIcons[weatherCode] || "weather-sunny-off",
	};
  });

	const labels = DATA.map((item: { formattedTime: string }) => item.formattedTime);
	const dataMin = DATA.map((item: { temperatureMin: number }) => item.temperatureMin);
	const dataMax = DATA.map((item: { temperatureMax: number }) => item.temperatureMax);

  return (
	<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
	  <View style={styles.container}>
		<View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
		  <Text style={styles.location}>{city ? city : "Edit location"}</Text>
		  <Text style={styles.region}>{state || ""}</Text>
		  <Text style={styles.country}>{country || ""}</Text>
		</View>
		<View style={{flex: 1}}>
		  <Text style={{color: 'turquoise', textAlign: 'center', fontSize: 24}}>Weekly temperatures</Text>
		  <LineChart
			data={{
			  labels: labels,
			  datasets: [
				{
					data: dataMin,
					color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
				},
				{
					data: dataMax,
					color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
				},
			  ]
			}}
			width={Dimensions.get("window").width}
			height={220}
			yAxisSuffix="°C"
			yAxisInterval={1}
			chartConfig={{
			// backgroundColor: "#e26a00",
			backgroundGradientFrom: 'grey',
			// backgroundGradientTo: "red",
			backgroundGradientToOpacity: 0.01,
			decimalPlaces: 1,
			  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
			  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
			  style: {
				borderRadius: 16
			  },
			  propsForDots: {
				r: "6",
				strokeWidth: "2",
				// stroke: "#ffa726"
			  }
			}}
			bezier
			style={{
			  marginVertical: 8,
			  borderRadius: 16
			}}
		  />
			<Text style={{textAlign: 'center'}}>
				<Text><Entypo name="dot-single" size={40} color="blue"/></Text>
				<Text style={{color: 'blue'}}>{"Min temperature"}</Text>
				<Text><Entypo name="dot-single" size={40} color="red" /></Text>
				<Text style={{color: 'red'}}>{"Max temperature"}</Text>
			</Text>
		</View>
		<FlatList
		  data={DATA}
		  keyExtractor={(item, index) => index.toString()}
		  horizontal={true}
		  showsHorizontalScrollIndicator={true}
		  renderItem={({ item }) =>
			<View style={styles.list}>
			  <Text style={styles.date}>{item.formattedTime}</Text>
			  <MaterialCommunityIcons name={item.iconName} size={50} color={getWeatherIconColor(item.weatherCode)} />
			  <Text style={[styles.max, { color: getTemperatureColor(item.temperatureMax) }]}>{"Max "}{item.temperatureMax + "°C"|| ""}</Text>
			  <Text style={[styles.min, { color: getTemperatureColor(item.temperatureMin) }]}>{"Min "}{item.temperatureMin + "°C"|| ""}</Text>
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
	width: 100,
	height: 100,
	justifyContent: 'center',
	alignItems: 'center',
	marginHorizontal: 5,
  },
  date: {
	textAlign: 'center',
	color: "white",
  },
  min: {
	textAlign: 'center'
  },
  weatherDescription: {
	textAlign: 'center'
  },
  max: {
	textAlign: 'center'
  },
});
