import React from 'react';
import './HistoryCard.css';

const HistoryCard = ({ day,date, icon, temperature }) => {
    return (
        <div className="weather-card">
            <h3>{day}</h3>
            <h3>{date}</h3>
            <img src={icon} alt="weather icon" />
            <p>{temperature}°C</p>
        </div>
    );
};

export default HistoryCard;