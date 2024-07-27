const mongoose = require('mongoose');

const weeklySummarySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    summaries: [{
        date: {
            type: Date,
            required: true,
        },
        avgTemp: {
            type: Number,
            required: true,
        },
        maxTemp: {
            type: Number,
            required: true,
        },
        minTemp: {
            type: Number,
            required: true,
        },
        dominantWeather: {
            type: String,
            required: true,
        },
    }],
}, { timestamps: true });

module.exports = mongoose.model('WeeklySummary', weeklySummarySchema);
