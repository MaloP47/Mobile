import React, { useState, useEffect } from 'react';
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
import { reverseLoc, currentMeteo } from './utils/api';
import checkGeo from './customHooks/checkGeo';

import useOrientation from './customHooks/useOrientation';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useDebounce } from 'use-debounce'
import { SafeAreaView } from 'react-native-safe-area-context';

interface Route {
	key: string;
	title: string;
	icon: string;
}
  
export default function app() {

	const layout = useWindowDimensions();
	const orientation = useOrientation();

	const [routes] = useState<Route[]>([
		{ key: 'first', title: 'Currently', icon: "sunny-outline" },
		{ key: 'second', title: 'Today', icon: "today-outline" },
		{ key: 'third', title: 'Weekly', icon: "calendar-outline" },
	]);
	const [index, setIndex] = useState<number>(0);

	const [isGeoLocActivated, setIsGeoLocActivated] = useState(false);

	const [geoLocation, setGeoLocation] = useState<Location.LocationObject | null | undefined>(null);

	const [firstTimeCheckGeo, setFirstTimeCheckGeo] = useState(true);

	


	// useEffect(() => {
	// 	checkGeo(setGeoActivated);
	//   }, []);

	
	//   useEffect(() => {
	// 	const fetchLocation = async () => {
	// 	  if (geoActivated) {
	// 		const locH = await reverseLoc(2.340143, 48.9097358);
	// 		if (locH && locH.address) {
	// 		  const { city, state, country, town } = locH.address;
	// 		  console.log(locH);
	// 		  console.log(`${city}, ${town}, ${state}, ${country}`);
	// 		  setDefLocation(locH);
	// 		}
	// 	  }
	// 	};
	
	// 	fetchLocation();
	//   }, [geoActivated]);
	


	// if (geoActivated === true) {
	// 	const fetchLocation = async () => {
	// 		const locH = await reverseLoc(2.340143, 48.9097358);
	// 		if (locH && locH.address) {
	// 			const { city, state, country, town } = locH.address;
	// 			console.log(locH);
	// 			console.log(`${city}, ${town}, ${state}, ${country}`);
	// 			setDefLocation(locH);
	// 		}
	// 	};
	// 	useEffect(() => {
	// 		fetchLocation();
	// 	}, []);
	// }

	// const fetchCity = async (query: string) => {
	// 	if (query.length < 3) {
	// 		setCitySuggestions([]);
	// 		return;
	// 	}
	// 	try {
	// 		const response = await fetch(
	// 			`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=fr`
	// 		);
	// 		const data = await response.json();
	// 		if (data && data.results) {
	// 			setCitySuggestions(data.results);
	// 		} else {
	// 			setCitySuggestions([]);
	// 		}
	// 	} catch (error) {
	// 		console.log("Error fetching geo API " + error);
	// 		setCitySuggestions([]);
	// 	}
	// }

	// useEffect(() => {
	// 	fetchCity(debouncedSearchText);
	// }, [debouncedSearchText]);

	// useEffect(() => {
	// 	const reqLocation = async () => {
	// 		const loc = await handleGeoLocation();
	// 		if (loc) {
	// 			setLocation(loc);
	// 		} else {
	// 			console.log('None at launch')
	// 		}
	// 	};
	// 	reqLocation();
	// }, []);

	const renderScene = ({ route }: { route: Route }) => {
		switch (route.key) {
			case 'first':
				return <Currently location={geoLocation} />;
			case 'second':
				return <Today location={geoLocation} />;
			case 'third':
			return <Weekly location={geoLocation} />;
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
					autoComplete='country'
					placeholder='Search location...'
					maxLength={30}
				/>
				<Text style={{fontSize: 24, lineHeight: 20}}>|  </Text>
				<Ionicons
					name="location-outline"
					size={32} color="black"
					onPress={async () => {
						const activated = await handleGeoLocation(firstTimeCheckGeo);
						setFirstTimeCheckGeo(false)
						setIsGeoLocActivated(activated)
						if (isGeoLocActivated) {
							const location = await Location.getCurrentPositionAsync();
							if (location && location.coords.latitude && location.coords.latitude) {
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
						}
					}}
				/>
			</View>
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
		backgroundColor: 'white',
		position: 'absolute',
		top: 40,
		left: 0,
		right: 0,
		zIndex: 1,
		maxHeight: 200,
		borderColor: '#ccc',
		borderWidth: 1,
	},
	itemSugg: {
		padding: 10,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		backgroundColor: 'pink',
	},
	textSugg: {
		fontSize: 16,
	},
});


				{/* {citySuggestions.length > 0 && (
					<View style={styles.citySugg}>
						<FlatList
							data={citySuggestions}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.itemSugg}
									onPress={() => {
										console.log("Touch sugg");
										setSearchText(`${item.name}, ${item.country}`);
										setCitySuggestions([]);
									}}
								>
									<Text style={styles.textSugg}>
										{item.name}, {item.admin1 ? item.admin1 + ', ' : ''}
										{item.country}
									</Text>
								</TouchableOpacity>
							)}
						/>
					</View>
				)} */}
