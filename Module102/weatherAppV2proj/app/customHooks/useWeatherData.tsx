import { useState, useEffect } from "react";
import { currentMeteo, todayMeteo, weeklyMeteo } from "../utils/api";

export const useWeatherData = (longitude?: number, latitude?: number) => {
    const [weatherData, setWeatherData] = useState({
        currentWeather: null,
        todayWeather: null,
        weeklyWeather: null,
    });

    const [errors, setErrors] = useState({
        currentWeatherError: null,
        todayWeatherError: null,
        weeklyWeatherError: null,
    });

    useEffect(() => {
        if (longitude == null || latitude == null) {
            return;
        }

        const fetchData = async () => {
            try {
                const current = await currentMeteo(longitude, latitude);
                const today = await todayMeteo(longitude, latitude);
                const weekly = await weeklyMeteo(longitude, latitude);

                setWeatherData({
                    currentWeather: current,
                    todayWeather: today,
                    weeklyWeather: weekly,
                });
                setErrors({
                    currentWeatherError: null,
                    todayWeatherError: null,
                    weeklyWeatherError: null,
                });
            } catch (error) {
                setErrors({
                    currentWeatherError: error as any,
                    todayWeatherError: error as any,
                    weeklyWeatherError: error as any,
                });
            }
        };

        fetchData();
    }, [longitude, latitude]);

    return { weatherData, errors };
};
