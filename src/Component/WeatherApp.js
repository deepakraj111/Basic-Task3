import React, { useState } from 'react';
import axios from 'axios';
import './WeatherApp.css'; // Import CSS file

const WeatherApp = () => {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [backgroundClass, setBackgroundClass] = useState('default');

    const fetchWeather = async (location) => {
        try {
            const API_KEY = 'b1acf5ad58207f82b893cc4d3b3d7258'; // Replace with your OpenWeatherMap API key
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                params: {
                    q: location,
                    appid: API_KEY,
                    units: 'metric',
                }
            });
            console.log(response.data); // Log the API response
            const filteredData = filterForecastData(response.data.list);
            setWeatherData({ ...response.data, list: filteredData });
            setWeatherBackground(filteredData[0].weather[0].main);
        } catch (error) {
            console.error('Error fetching weather data', error);
        }
    };

    const filterForecastData = (list) => {
        const filtered = [];
        const dateMap = {};

        list.forEach(forecast => {
            const date = forecast.dt_txt.split(' ')[0];
            if (dateMap[date]) {
                if (Math.abs(new Date(dateMap[date].dt_txt).getHours() - 12) > Math.abs(new Date(forecast.dt_txt).getHours() - 12)) {
                    dateMap[date] = forecast;
                }
            } else {
                dateMap[date] = forecast;
            }
        });

        for (let date in dateMap) {
            filtered.push(dateMap[date]);
        }

        return filtered.slice(0, 5); // Return only the next 5 days
    };

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (location) {
            fetchWeather(location);
        }
    };

    const setWeatherBackground = (weatherMain) => {
        let backgroundClass = 'default';
        switch (weatherMain) {
            case 'Clear':
                backgroundClass = 'sunny';
                break;
            case 'Clouds':
                backgroundClass = 'cloudy';
                break;
            case 'Rain':
            case 'Drizzle':
            case 'Thunderstorm':
                backgroundClass = 'rainy';
                break;
            case 'Snow':
                backgroundClass = 'snowy';
                break;
            default:
                backgroundClass = 'default';
        }
        console.log('Weather:', weatherMain, 'Class:', backgroundClass); // Log the weather and class
        setBackgroundClass(backgroundClass);
    };

    const getIconUrl = (icon) => {
        return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    };

    return (
        <div className={`weather-app ${backgroundClass}`}>
            {console.log('Applied Class:', backgroundClass)} {/* Log the applied class */}
            <form onSubmit={handleFormSubmit}>
                <input 
                    type="text" 
                    value={location} 
                    onChange={handleInputChange} 
                    placeholder="Enter location" 
                />
                <button type="submit">Get Weather</button>
            </form>
            {weatherData && (
                <div>
                    <h1>Weather Forecast Of {weatherData.city.name} for Next Five Days</h1>
                    <ul>
                        {weatherData.list.map((forecast, index) => (
                            <li key={index}>
                                <div>
                                    {new Date(forecast.dt_txt).toLocaleDateString()}: {forecast.main.temp}°C, {forecast.weather[0].description}
                                </div>
                                <img 
                                    src={getIconUrl(forecast.weather[0].icon)} 
                                    alt={forecast.weather[0].description} 
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;
