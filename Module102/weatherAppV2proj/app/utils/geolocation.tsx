import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

const handleGeoLocation = async () => {
	try {
		let { status } = await Location.getForegroundPermissionsAsync();

	if (status !== 'granted') {
		const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
	  	if (newStatus !== 'granted') {
			Alert.alert(
		  'On start geoloc denied',
		  'Please allow geoloc',
		  [
			{ text: 'Cancel', style: 'cancel' },
			{
			  text: 'Open settings',
			  onPress: () => {
				if (Platform.OS === 'ios') {
				  Linking.openURL('app-settings:');
				} else {
				  Linking.openSettings();
				}
			  },
			},
		  ],
		);
		return null;
	  }
	}
	const location = await Location.getCurrentPositionAsync();
	console.log("Loc OK");
	const response = await fetch(
		`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&language=fr`
	);
	const data = await response.json();
	if (data && data.results && data.results.lenght > 0) {
		const localisation = data.results[0];
		return {
			...location,
			city: localisation.name,
			region: localisation.admin1,
			country: localisation.country,
		};
	} else {
		return location;
	}
  } catch (error) {
	console.log('Error geoloc API', error);
	return null;
  }
};

export default handleGeoLocation;
