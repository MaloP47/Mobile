import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions, Text, StyleSheet, TextInput } from 'react-native';
import { TabView, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Currently from './components/Currently';
import Today from './components/Today';
import Weekly from './components/Weekly';
import handleGeoLocation from './utils/geolocation';
import { LocationObject } from 'expo-location';
import useOrientation from './customHooks/orientationScreen';
import Ionicons from '@expo/vector-icons/Ionicons';

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
			console.log('coucou');
			console.log(loc);
			setSearchText(`Latitude: ${loc.coords.latitude}, Longitude: ${loc.coords.longitude}`);
		} else {
			console.log('Icon not working')
		}
	};

	const renderScene = ({ route }: { route: Route }) => {
		switch (route.key) {
			case 'first':
				return <Currently searchText={searchText} />;
			case 'second':
				return <Today searchText={searchText} />;
			case 'third':
			return <Weekly searchText={searchText} />;
		default:
			return null;
		}
	  };

  	const renderTab = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
    	<TabBar {...props}
			renderIcon={({route}) => (
				<Ionicons name={route.icon as any} size={24} color="black" />
			)}
			renderLabel={({route, focused }) => (
				<Text style={styles.label} numberOfLines={2} >{route.title}</Text>
			)}
			indicatorStyle={{ backgroundColor: 'grey', height: 5}}
			style={styles.barTab}
		/>
  	);

	return (
		<View style={{flex: 1}}>
			<View style={styles.topBar}>
				<Ionicons
					name="search-sharp"
					size={32}
					color="black"
					onPress={() => {
						console.log('search pressed');
					  }}
				/>
				<TextInput
					style={styles.searchInput}
					cursorColor='black'
					placeholder='Search location...'
					maxLength={30}
					value={searchText}
					// onChangeText={(text) => {
					// 	setSearchText(text);
					//   }}
				/>
				<Text style={{fontSize: 24, lineHeight: 20}}>|  </Text>
				<Ionicons
					name="location-outline"
					size={32} color="black"
					// onPress={() => {
					// 	setSearchText('Geolocation');
					//   }}
					onPress={iconLoc}
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
		</View>
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
});
