import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function Currently() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Currently</Text>
    </View>
  );
}

function Today() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Today</Text>
    </View>
  );
}

function Weekly() {
	return (
	  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		<Text>Weekly</Text>
	  </View>
	);
  }

const Tabs = createBottomTabNavigator();

function BottomBar() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Currently" component={Currently} />
      <Tabs.Screen name="Today" component={Today} />
	  <Tabs.Screen name="Weekly" component={Weekly} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer  independent={true} >
      <BottomBar />
    </NavigationContainer>
  );
}
