// WeatherScroll.js
import React from 'react';
import HistoryCard from './HistoryCard';
import './WeatherScroll.css';

// Function to map weather conditions to icon URLs
const getWeatherIcon = (condition) => {
    const iconMap = {
        "Clear": "https://openweathermap.org/img/wn/01d.png",
        "Clouds": "https://openweathermap.org/img/wn/02d.png",
        "Rain": "https://openweathermap.org/img/wn/03d.png",
        "Drizzle": "https://openweathermap.org/img/wn/04d.png",
        "Thunderstorm": "https://openweathermap.org/img/wn/11d.png",
        "Snow": "https://openweathermap.org/img/wn/13d.png",
        "Mist": "https://openweathermap.org/img/wn/50d.png",
        // Add more mappings as needed
    };
    return iconMap[condition] || "https://openweathermap.org/img/wn/01d.png"; // Default icon if condition not found
};

// Function to extract the day of the week from a date string
const formatDateToDay = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long' };
    return date.toLocaleDateString(undefined, options);
};

// Function to format the date string into a readable date
const formatDateToDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
};

const WeatherScroll = ({ weatherData }) => {
    return (
        <div className="comp">
            <h2>Weekly Weather Summary</h2>
            <div className="weather-scroll">
                {weatherData.map((data, index) => {
                    const isLastElement = index === weatherData.length - 1;
                    return (
                        <HistoryCard
                            key={index}
                            day={isLastElement ? 'Yesterday' : formatDateToDay(data.date)}
                            date={formatDateToDisplayDate(data.date)}
                            icon={getWeatherIcon(data.dominantWeather)}
                            temperature={data.avgTemp}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default WeatherScroll;

