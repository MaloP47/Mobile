import React, { useState, useEffect } from 'react';
import {
	View,
	useWindowDimensions,
	Text,
	StyleSheet,
	TextInput,
	FlatList,
	TouchableOpacity,
	StatusBar
} from 'react-native';
import { TabView, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';

import Currently from './components/Currently';
import Today from './components/Today';
import Weekly from './components/Weekly';

import handleGeoLocation from './utils/geolocation';
import { toHumanLoc } from './utils/toHumanLoc';
import useOrientation from './customHooks/useOrientation';
import { LocationObject } from 'expo-location';
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
	const [searchText, setSearchText] = useState<string>('');
	const [location, setLocation] = useState<LocationObject | null>(null);
	const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
	const [debouncedSearchText] = useDebounce(searchText, 500);

	const [defLocation, setDefLocation] = useState(null)
	const fetchLocation = async () => {
		const locH = await toHumanLoc(2.340143, 48.9097358);
		if (locH && locH.address) {
			const { city, state, country, town } = locH.address;
			console.log(locH);
			console.log(`${city}, ${town}, ${state}, ${country}`);
			setDefLocation(locH);
		}
	};
	useEffect(() => {
		fetchLocation();
	}, []);

	const fetchCity = async (query: string) => {
		if (query.length < 3) {
			setCitySuggestions([]);
			return;
		}
		try {
			const response = await fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=fr`
			);
			const data = await response.json();
			if (data && data.results) {
				setCitySuggestions(data.results);
			} else {
				setCitySuggestions([]);
			}
		} catch (error) {
			console.log("Error fetching geo API " + error);
			setCitySuggestions([]);
		}
	}

	useEffect(() => {
		fetchCity(debouncedSearchText);
	}, [debouncedSearchText]);

	useEffect(() => {
		const reqLocation = async () => {
			const loc = await handleGeoLocation();
			if (loc) {
				setLocation(loc);
			} else {
				console.log('None at launch')
			}
		};
		reqLocation();
	}, []);

	const iconLoc = async () => {
		const loc = await handleGeoLocation();
		if (loc) {
			setLocation(loc);
			console.log(loc);
			if ('city' in loc && 'country' in loc) {
				setSearchText(`${loc.city}, ${loc.country}`);
				console.log(searchText);
			}
		} else {
			console.log('Icon not working')
		}
	};

	const renderScene = ({ route }: { route: Route }) => {
		switch (route.key) {
			case 'first':
				return <Currently location={defLocation} />;
			case 'second':
				return <Today location={defLocation} />;
			case 'third':
			return <Weekly searchText={searchText} />;
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
		<SafeAreaView style={{flex: 1, justifyContent: "center"}}>
			<StatusBar
				backgroundColor="pink"
				hidden={false}
			/>
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
					value={searchText}
					onChangeText={(text) => {
						setSearchText(text);
					}}
					onSubmitEditing={() => {
						setSearchText('');
						setCitySuggestions([]);
					}}
					onBlur={() => {
						setCitySuggestions([]);
					}}
				/>
				{citySuggestions.length > 0 && (
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
				)}
				<Text style={{fontSize: 24, lineHeight: 20}}>|  </Text>
				<Ionicons
					name="location-outline"
					size={32} color="black"
					// onPress={() => {
					// 	setSearchText('Geolocation');
					//   }}
					onPress={iconLoc}
					// onPress={async () => {
					// 	const locH = await toHumanLoc(2.257679, 48.8436083);
					// 	if (locH && locH.address) {
					// 		const { city, state, country } = locH.address;
					// 		console.log(`${city}, ${state}, ${country}`);
					// 	}
					// }}
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
		// justifyContent: 'space-between',
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
