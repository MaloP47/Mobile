import React, { useState } from 'react';
import { View, useWindowDimensions, Text, StyleSheet, TextInput } from 'react-native';
import { TabView, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Currently from './components/Currently';
import Today from './components/Today';
import Weekly from './components/Weekly';
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

	const [index, setIndex] = useState(0);
	const [routes] = useState<Route[]>([
		{ key: 'first', title: 'Currently', icon: "sunny-outline" },
		{ key: 'second', title: 'Today', icon: "today-outline" },
		{ key: 'third', title: 'Weekly', icon: "calendar-outline" },
	]);
	const [searchText, setSearchText] = useState('');

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
					value={searchText === 'Geolocation' ? '' : searchText}
					onChangeText={(text) => {
						setSearchText(text);
					  }}
				/>
				<Text style={{fontSize: 24, lineHeight: 20}}>|  </Text>
				<Ionicons
					name="location-outline"
					size={32} color="black"
					onPress={() => {
						setSearchText('Geolocation');
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
