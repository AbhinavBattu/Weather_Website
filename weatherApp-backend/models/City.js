const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    weatherData: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Weather' }]
});

module.exports = mongoose.model('City', citySchema);
