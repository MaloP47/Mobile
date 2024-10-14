import axios from 'axios'

export const reverseLoc = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
		);
		console.log("ReverseLoc API called " + Date.now())
		return response?.data;
	} catch (error) {
		console.log("ReverseLoc "+ error);
		return null;
	}
};

export const currentMeteo = async (longitude: number, latitude: number) => {
	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m`;
		console.log(url);
		const response = await axios.get(url);
		console.log("Current API called " + Date.now())
		return response?.data;
	} catch (error) {
		console.log("Current "+ error);
		return null;
	}
};

export const todayMeteo = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_hours=12`
		);
		console.log("Today API called " + Date.now())
		return response?.data;
	} catch (error) {
		console.log("Today "+ error);
		return null;
	}
};

export const weeklyMeteo = async (longitude: number, latitude: number) => {
	try {
		const response = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_hours=12`
		);
		console.log("Weekly API called " + Date.now())
		return response?.data;
	} catch (error) {
		console.log("Weekly "+ error);
		return null;
	}
};

export const fullMeteo = async (longitude: number, latitude: number) => {
	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_hours=12`
		const response = await axios.get(url);
		return response?.data;
	} catch (error) {
		console.log("Full weather API "+ error);
		return null;
	}
}
