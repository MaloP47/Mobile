import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

const handleGeoLocation = async () => {
  try {
    // Obtenir le statut actuel de la permission sans demander à l'utilisateur
    let { status } = await Location.getForegroundPermissionsAsync();

    if (status !== 'granted') {
      // La permission n'est pas accordée, demander à l'utilisateur
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
      if (newStatus !== 'granted') {
        // L'utilisateur a refusé la permission
        Alert.alert(
          'Permission de localisation refusée',
          'Pour utiliser cette fonctionnalité, veuillez autoriser l\'accès à la localisation.',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Ouvrir les paramètres',
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
      // La permission a été accordée après la demande
      status = newStatus;
    }

    // La permission est accordée, obtenir la localisation
    const location = await Location.getCurrentPositionAsync();
    return location;
  } catch (error) {
    console.log('Erreur lors de la demande de localisation:', error);
    return null;
  }
};

export default handleGeoLocation;
