import { useState, useEffect } from "react";
import { currentMeteo, todayMeteo,weeklyMeteo } from "../utils/api";

interface WeatherData {
	currentWeather: any | null;
	todayWeather: any | null;
	weeklyWeather: any | null;
}

interface WeatherErrors {
	currentWeatherError: Error | null;
	todayWeatherError: Error | null;
	weeklyWeatherError: Error | null;
}

export const useWeatherData = (longitude: number, latitude: number) => {
	const [weatherData, setWeatherData] = useState<WeatherData>({
		currentWeather: null,
    	todayWeather: null,
    	weeklyWeather: null,
	});

	const [errors, setErrors] = useState<WeatherErrors>({
		currentWeatherError: null,
    	todayWeatherError: null,
    	weeklyWeatherError: null,
	});

	const [cacheTime, setCacheTime] = useState({
		currentRefresh: 0,
		todayRefresh: 0,
		weeklyRefresh: 0,
	});

	const cacheDuration = {
		currentDuration: 1 * 60 * 1000, //15min
		todayDuration: 60 * 60 * 1000, //1h
		weeklyDuration: 120 * 60 * 1000, //2h
	}

	useEffect(() => {
		const now = Date.now();

		const fetchData = async () => {
			if (now - cacheTime.currentRefresh > cacheDuration.currentDuration) {
				try {
					const data = await currentMeteo(longitude, latitude);
					setWeatherData((previousData) => ({ ...previousData, currentWeather: data}));
					setCacheTime((previousCache) => ({ ...previousCache, currentRefresh: now}));
					setErrors((previousErr) => ({ ...previousErr, currentWeatherError: null}));
				} catch (error) {
					setErrors((previousErr) => ({ ...previousErr, currentWeatherError: error as Error }));
				}
			}

			if (now - cacheTime.todayRefresh > cacheDuration.todayDuration) {
				try {
					const data = await todayMeteo(longitude, latitude);
					setWeatherData((previousData) => ({ ...previousData, todayWeather: data}));
					setCacheTime((previousCache) => ({ ...previousCache, todayRefresh: now}));
					setErrors((previousErr) => ({ ...previousErr, todayWeatherError: null}));
				} catch (error) {
					setErrors((previousErr) => ({ ...previousErr, todayWeatherError: error as Error }));
				}
			}

			if (now - cacheTime.weeklyRefresh > cacheDuration.weeklyDuration) {
				try {
					const data = await weeklyMeteo(longitude, latitude);
					setWeatherData((previousData) => ({ ...previousData, weeklyWeather: data}));
					setCacheTime((previousCache) => ({ ...previousCache, weeklyRefresh: now}));
					setErrors((previousErr) => ({ ...previousErr, weeklyWeatherError: null}));
				} catch (error) {
					setErrors((previousErr) => ({ ...previousErr, weeklyWeatherError: error as Error }));
				}
			}
		};
		fetchData();
	
	}, [longitude, latitude]);
	return {weatherData, errors};

}
