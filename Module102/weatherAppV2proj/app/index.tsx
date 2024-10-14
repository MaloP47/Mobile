import React, { useState, useEffect, useCallback } from 'react';
import {
	View,
	useWindowDimensions,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	TouchableOpacity,
	Platform,
} from 'react-native';
import { TabView, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';

import Currently from './components/Currently';
import Today from './components/Today';
import Weekly from './components/Weekly';

import handleGeoLocation from './utils/handleGeolocation';
import { reverseLoc, searchCity } from './utils/api';

import useOrientation from './customHooks/useOrientation';
import { useWeatherData } from './customHooks/useWeatherData';

import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useDebounce } from 'use-debounce'
import { SafeAreaView } from 'react-native-safe-area-context';

import debounce from 'lodash.debounce';

interface Route {
	key: string;
	title: string;
	icon: string;
}
  
export default function app() {

	const [routes] = useState<Route[]>([
		{ key: 'first', title: 'Currently', icon: "sunny-outline" },
		{ key: 'second', title: 'Today', icon: "today-outline" },
		{ key: 'third', title: 'Weekly', icon: "calendar-outline" },
	]);
	const [index, setIndex] = useState<number>(0);
	const [isGeoLocActivated, setIsGeoLocActivated] = useState(false);
	const [geoLocation, setGeoLocation] = useState<Location.LocationObject | City | null | undefined>(null);
	const [firstTimeCheckGeo, setFirstTimeCheckGeo] = useState(true);
	const [coordinates, setCoordinates] = useState<{ longitude: number; latitude: number } | null>(null);
	const [weatherData, setWeatherData] = useState<any>(null);
	const [errors, setErrors] = useState<string | null>(null);

	const [textInput, setTextInput] = useState<string | null>(null);
	const [cityData, setCityData] =  useState<string | null>(null);

	const layout = useWindowDimensions();
	const orienation = useOrientation();

	const fetchCityData = async (input: string) => {
		try {
			if (input.length > 3) {
				const data = await searchCity(input);
				setCityData(data);
			} else {
				setCityData(null);
			}
		} catch (error) {
			console.log("FetchCityData" + error);
		}
	};

	const debounceFetch = useCallback(debounce(fetchCityData, 500), []);

	const handleTextChange = (text: string) =>	{
		setTextInput(text);
		debounceFetch(text);
	}

	interface City {
		id: number;
		name: string;
		country: string;
		admin1: string;
		longitude: number;
		latitude: number;
	}
	
		const handleCity = async (city: City) => {
		try {
			setCoordinates({ longitude: city.longitude, latitude: city.latitude });
			setGeoLocation(city);
			setTextInput('');
			setCityData(null);
			console.log(city);
		} catch (error) {
			console.log("HandleCity " + error);
		}
	};


	const renderScene = ({ route }: { route: Route }) => {
		switch (route.key) {
			case 'first':
				return <Currently location={geoLocation} weather={weatherData?.currentWeather} />;
			case 'second':
				return <Today location={geoLocation} weather={weatherData?.todayWeather} />;
			case 'third':
			return <Weekly location={geoLocation} weather={weatherData?.weeklyWeather} />;
		default:
			return null;
		}
	  };

  	const renderTab = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
    	<TabBar {...props}
			renderIcon={({ route }) => (
				<Ionicons name={route.icon as any} size={24} color="black" />
			)}
			renderLabel={({ route, focused }) => (
				<Text style={styles.label} numberOfLines={2} >{route.title}</Text>
			)}
			indicatorStyle={{ backgroundColor: 'grey', height: 5}}
			style={styles.barTab}
		/>
  	);

	return (
		<SafeAreaView style={ styles.safe }>
			<View style={styles.topBar}>
				<Ionicons
					name="search-sharp"
					size={32}
					color="black"
					onPress={() => {
						console.log('search pressed');
					  }} // gérer ça
				/>
				<TextInput
					style={styles.searchInput}
					cursorColor='black'
					selectionColor={"black"}
					placeholder='Search location...'
					onChangeText={handleTextChange}
					maxLength={15}
				/>
				<Text style={{fontSize: 24, lineHeight: 20}}>|  </Text>
				<Ionicons
					name="location-outline"
					size={32} color="black"
					onPress={async () => {
						const activated = await handleGeoLocation(firstTimeCheckGeo);
						setFirstTimeCheckGeo(false)
						setIsGeoLocActivated(activated)
						if (activated) {
							try {
								const location = await Location.getCurrentPositionAsync();
								if (location && location.coords) {
									const { longitude, latitude } = location.coords;
									setCoordinates({ longitude, latitude });
									const reverse = await reverseLoc(location.coords.longitude, location.coords.latitude);
									if (reverse && reverse.address) {
										setGeoLocation(reverse);
									} else {
										setGeoLocation(undefined);
										console.log("Fuck");
									}
								} else {
									console.log("Problem with mobile API");
								}
							} catch (error) {
								console.error('Error fetching location:', error);
							}
						}
					}}
					/>
			</View>
			{cityData && (
				<FlatList
					data={cityData.results}
					keyExtractor={(item) => item.id.toString()}
					renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleCity(item)} style={styles.itemSugg}>
						<Text style={styles.textSugg}>{item.name}, {item.country}, {item.admin1}</Text>
					</TouchableOpacity>
					)}
					style={styles.citySugg}
					contentContainerStyle={styles.suggestionsContainer}
				/>
				)}
			<TabView
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={{ width: layout.width }}
				tabBarPosition='bottom'
				renderTabBar={renderTab}
			/>
		</SafeAreaView>
  	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? -20 : -50,
        paddingBottom: -50,
	},
	barTab: {
		backgroundColor: 'white',
	},
	searchInput: {
		flex: 1,
		color: 'black',
	},
	topBar: {
		flexDirection: 'row',
    	alignItems: 'center',
    	paddingHorizontal: 10,
    	height: 50,
    	backgroundColor: 'grey',
	},
	label: {
		color: 'black',
		textTransform: 'none',
		textAlign: 'center',
		flexWrap: 'wrap',
	},
	citySugg: {
		backgroundColor: 'pink',
		position: 'absolute',
		width: "100%",
		top: 55,
		zIndex: 1,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	itemSugg: {
		padding: 10,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	textSugg: {
		fontSize: 16,
		textAlign: 'center',
	},
	suggestionsContainer: {
		justifyContent: 'center',
	},
});
