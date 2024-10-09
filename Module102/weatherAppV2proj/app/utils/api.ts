import axios from 'axios'

export const reverseLoc = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
		);
		return response?.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const currentMeteo = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`
		);
		return response?.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const todayMeteo = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_hours=12`
		);
		return response?.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const weeklyMeteo = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_hours=12`
		);
		return response?.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
