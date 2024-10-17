const getTemperatureColor = (temperature: number | undefined) => {
	if (temperature === undefined) return 'white';
	if (temperature <= 10) return '#00008B';
	if (temperature > 10 && temperature <= 17) return '#ADD8E6';
	if (temperature > 17 && temperature <= 22) return '#87CEEB';
	if (temperature > 22 && temperature <= 27) return '#FFD700';
	if (temperature > 27 && temperature <= 32) return '#FFA500';
	if (temperature > 32) return '#FF4500';
};

const getWindSpeedColor = (windSpeed: number | undefined) => {
	if (windSpeed === undefined) return 'white'; // Couleur par défaut
	if (windSpeed <= 5) return '#00FA9A'; // Vent faible - vert clair
	if (windSpeed > 5 && windSpeed <= 11) return '#7FFF00'; // Brise légère - vert vif
	if (windSpeed > 11 && windSpeed <= 19) return '#FFD700'; // Brise modérée - jaune
	if (windSpeed > 19 && windSpeed <= 28) return '#FF8C00'; // Vent frais - orange
	if (windSpeed > 28 && windSpeed <= 38) return '#FF4500'; // Fort coup de vent - rouge
	if (windSpeed > 38 && windSpeed <= 49) return '#DC143C'; // Tempête modérée - rouge foncé
	if (windSpeed > 49) return '#8B0000'; // Tempête forte - bordeaux
};

const getWeatherIconColor = (weatherCode: number | undefined): string => {
	if (weatherCode === undefined) return 'white'; // Couleur par défaut

	if ([0, 1].includes(weatherCode)) return '#FFD700'; // Ciel clair (ensoleillé) - Jaune
	if ([2, 3].includes(weatherCode)) return '#B0C4DE'; // Partiellement nuageux / Couvert - Bleu gris
	if ([45, 48].includes(weatherCode)) return '#708090'; // Brouillard - Gris ardoise
	if ([51, 53, 55, 56, 57].includes(weatherCode)) return '#4682B4'; // Bruine / Pluie légère - Bleu acier
	if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) return '#1E90FF'; // Pluie - Bleu dodger
	if ([66, 67].includes(weatherCode)) return '#87CEEB'; // Pluie verglaçante - Bleu clair
	if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '#ADD8E6'; // Neige - Bleu très clair
	if ([95, 96, 99].includes(weatherCode)) return '#FF4500'; // Orage / Grêle - Rouge orangé
	return 'white'; // Couleur par défaut si le code météo n'est pas trouvé
	};
  

export { getTemperatureColor, getWindSpeedColor, getWeatherIconColor };
