import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

const handleGeoLocation = async (firstTime: boolean) => {
	try {
		let { status } = await Location.getForegroundPermissionsAsync();

		if (status !== 'granted') {
			const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
	  		if (newStatus !== 'granted') {
				Alert.alert(
					'Geoloc denied',
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
				return false;
	  		}
		}
		return true;
	} catch (error) {
		console.log('Error phone geoloc API', error);
		return false;
	}
};

export default handleGeoLocation;
