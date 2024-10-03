import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Currently from './components/Currently';
import Today from './components/Today';
import Weekly from './components/Weekly';
import useOrientation from './customHooks/orientationScreen';

import Ionicons from '@expo/vector-icons/Ionicons';

{/* <Ionicons name="sunny-outline" size={24} color="black" /> */}
{/* <Ionicons name="today-outline" size={24} color="black" /> */}
{/* <Ionicons name="calendar-outline" size={24} color="black" /> */}

const renderScene = SceneMap({
	first: Currently,
	second: Today,
	third: Weekly
});

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

  const renderTab = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => (
    <TabBar {...props}
		renderIcon={({route}) => (
			<Ionicons name={route.icon} size={24} color="black" />
		)}
		renderLabel={({route, focused }) => (
			<Text style={{color: "black", textTransform: "none" }} >{route.title}</Text>
		)}
		indicatorStyle={{ backgroundColor: 'grey', height: 5}}
		style={styles.barTab}
	/>
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
	  tabBarPosition='bottom'
	  renderTabBar={renderTab}
    />
  );
}

const styles = StyleSheet.create({
	barTab: {
		backgroundColor: 'white',
	},
});
