import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ avgTemp, maxTemp, minTemp ,dominant}) => {
    // console.log(avgTemp);
    // console.log(maxTemp);
    // console.log(minTemp);
    return (
        <div className="weather-summary-card">
            <h2>Daily Summary</h2>
            <div className="weather-details">
                <div className="weather-detail">
                    <h3>Average Temperature</h3>
                    <p>{avgTemp}</p>
                </div>
                <div className="weather-detail">
                    <h3>Maximum Temperature</h3>
                    {/* <h3>Temperature</h3> */}
                    <p>{maxTemp}</p>
                </div>
                <div className="weather-detail">
                    <h3>Minimum Temperature</h3>
                    <p>{minTemp}</p>
                </div>
                <div className="weather-detail">
                    <h3>Dominant Weather</h3>
                    <p>{dominant}</p>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;
