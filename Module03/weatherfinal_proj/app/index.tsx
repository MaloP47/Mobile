import React, { useState, useCallback } from 'react';
import {
	View,
	useWindowDimensions,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	TouchableOpacity,
	Platform,
	ImageBackground,
	ScrollView
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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

	const [textInput, setTextInput] = useState<string | null>(null);
	interface CityData {
		results: City[];
	}
	
	const [cityData, setCityData] =  useState<CityData | null>(null);

	const layout = useWindowDimensions();
	const orienation = useOrientation();
	const { weatherData, errors } = useWeatherData(coordinates?.longitude, coordinates?.latitude);


	const fetchCityData = async (input: string, isSubmit: boolean = false) => {
		try {
			if (input.length > 3 || isSubmit) {
				const data = await searchCity(input);
				const nbRes = Object.keys(data.results).length;
				if (nbRes < 2) {
					return null;
				}
				setCityData(data);
				// console.log(data)
				return data;
			} else {
				setCityData(null);
				return null;
			}
		} catch (error) {
			setCityData([]);
			console.log("FetchCityData" + error);
		}
	};

	const debounceFetch = useCallback(debounce(fetchCityData, 500), []);

	const handleTextChange = (text: string) =>	{
		setTextInput(text);
		debounceFetch(text);
	}

	const handleSubmit = async () => {
		if (textInput && textInput.length > 0) {
			try {
				const data = await fetchCityData(textInput);
				// console.log(data)
				if (!data || !data.results || data.results.length === 0) {
					console.log("NO DATA FOUND");
					setCityData([]);
				} else {
					handleCity(data.results[0]);
				}
			} catch (error) {
				console.log("HandleSubmit error: " + error);
			}
		} else {
			console.log("PLEASE ENTER A VALID LOCATION");
		}
	};

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
				<Ionicons name={route.icon as any} size={35} color="white" />
			)}
			renderLabel={({ route, focused }) => (
				<Text style={styles.label} numberOfLines={2} >{route.title}</Text>
			)}
			indicatorStyle={{ backgroundColor: 'white', height: 5,}}
			style={styles.barTab}
		/>
  	);

	return (
		<SafeAreaView style={ styles.safe }>
			<ImageBackground source={require('../assets/images/blue.jpg')} style={{zIndex: -1000, flex: 1}}>
					<View style={styles.topBar}>
						<Ionicons
							name="search-sharp"
							size={40}
							color="white"
							onPress={handleSubmit}
						/>
						<TextInput
							style={styles.searchInput}
							cursorColor='white'
							selectionColor={"white"}
							placeholder=' Search location...'
							placeholderTextColor={"white"}
							onChangeText={handleTextChange}
							onSubmitEditing={handleSubmit}
							maxLength={15}
						/>
						<Text style={{fontSize: 24, lineHeight: 20, color: 'white'}}>|  </Text>
						<Ionicons
							name="location-outline"
							size={32} color="white"
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
					{cityData && (cityData.length == 0 ? (
						<Text style={{textAlign: "center", color: 'red', alignItems: 'center', fontSize: 32}}>No data</Text>
					)
					: (
						<FlatList
							data={cityData.results}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
							<TouchableOpacity onPress={() => handleCity(item)} style={styles.itemSugg}>
								<Text>
									<MaterialCommunityIcons name="home-city-outline" size={20} color="black" />
									<Text style={styles.textSuggName}>   {item.name}, </Text>
									<Text style={styles.textSuggRegion}>{item.admin1}, </Text>
									<Text style={styles.textSuggCountry}>{item.country}</Text>
								</Text>
							</TouchableOpacity>
							)}
							style={styles.citySugg}
							contentContainerStyle={styles.suggestionsContainer}
						/>
						))}
					<TabView
						navigationState={{ index, routes }}
						renderScene={renderScene}
						onIndexChange={setIndex}
						initialLayout={{ width: layout.width }}
						tabBarPosition='bottom'
						renderTabBar={renderTab}
						style={{borderColor: "yellow"}}
					/>
			</ImageBackground>
		</SafeAreaView>
  	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
        justifyContent: 'center',
        paddingTop: Platform.OS === "android" ? -20 : -50,
        paddingBottom: -50,
		// backgroundColor: "pink",
	},
	barTab: {
		backgroundColor: 'transparent',
	},
	searchInput: {
		flex: 1,
		color: 'white',
	},
	topBar: {
		flexDirection: 'row',
    	alignItems: 'center',
    	paddingHorizontal: 10,
    	height: 50,
    	backgroundColor: 'transparent',
	},
	label: {
		color: 'white',
		textTransform: 'none',
		fontSize: 16,
		textAlign: 'center',
		flexWrap: 'wrap',
	},
	citySugg: {
		backgroundColor: 'white',
		position: 'absolute',
		width: "100%",
		top: 50,
		zIndex: 1,
		// borderColor: 'red',
		borderWidth: 1,
	},
	itemSugg: {
		padding: 10,
		borderBottomColor: 'black',
		borderBottomWidth: 3,
	},
	textSuggName: {
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	textSuggRegion: {
		fontSize: 12,
		textAlign: 'center',
	},
	textSuggCountry: {
		fontSize: 12,
		textAlign: 'center',
	},
	suggestionsContainer: {
		justifyContent: 'center',
	},
});
