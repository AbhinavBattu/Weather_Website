const mongoose = require('mongoose');

const weatherSummarySchema = new mongoose.Schema({
    city: { type: String, required: true },
    date: { type: Date, required: true },
    avgTemp: Number,
    maxTemp: Number,
    minTemp: Number,
    dominantWeather: String
});

module.exports = mongoose.model('WeatherSummary', weatherSummarySchema);
