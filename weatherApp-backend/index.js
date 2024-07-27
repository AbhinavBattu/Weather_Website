const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Weather = require('./models/Weather');
const City = require('./models/City');
const WeeklySummary = require('./models/WeeklySummary');
const WeatherSummary = require('./models/WeatherSummary');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
// console.log(process.env.PORT);
mongoose.connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 50000,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

async function fetchWeatherData() {
    const currentHour = new Date();
    currentHour.setMinutes(0, 0, 0); // Round to the start of the hour

    for (const cityName of cities) {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.ApiKey}`);
            const { main, weather } = response.data;
            const tempCelsius = main.temp - 273.15;
            const feelsLikeCelsius = main.feels_like - 273.15;

            const weatherData = new Weather({
                main: weather[0].main,
                temp: tempCelsius,
                feels_like: feelsLikeCelsius,
                dt: currentHour.getTime() / 1000, // Store the Unix timestamp of the current hour
            });

            const city = await City.findOneAndUpdate(
                { name: cityName },
                { $push: { weatherData: weatherData._id } },
                { upsert: true, new: true }
            );

            await weatherData.save();
            console.log(`Weather data for ${cityName} at hour ${currentHour} saved.`);
        } catch (error) {
            console.error(`Error fetching weather data for ${cityName}:`, error);
        }
    }
}

async function cleanupOldWeatherData() {

    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000;
    for (const cityName of cities) {
        const city = await City.findOne({ name: cityName }).populate('weatherData');
        if (!city) continue;
        const weatherDataToRemove = [];
        for (const dataId of city.weatherData) {
            const weather = await Weather.findById(dataId);
            if (weather && weather.dt < startOfDay) {
                weatherDataToRemove.push(dataId);
            }
        }

        await Weather.deleteMany({ _id: { $in: weatherDataToRemove } });
        await City.updateOne(
            { name: cityName },
            { $pull: { weatherData: { $in: weatherDataToRemove } } }
        );

        console.log(`Old weather data for ${cityName} cleaned up.`);
    }
}

async function calculateDailySummaries() {
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0)).getTime() / 1000;

    for (const cityName of cities) {
        const city = await City.findOne({ name: cityName }).populate('weatherData');
        if (!city) continue;

        const weatherData = city.weatherData.filter(data => data.dt >= startOfDay);

        if (weatherData.length > 0) {
            const avgTemp = Math.round((weatherData.reduce((sum, data) => sum + data.temp, 0) / weatherData.length) * 100) / 100;
            const maxTemp = Math.round(Math.max(...weatherData.map(data => data.temp)) * 100) / 100;
            const minTemp = Math.round(Math.min(...weatherData.map(data => data.temp)) * 100) / 100;
            const dominantWeather = weatherData
                .map(data => data.main)
                .reduce((prev, curr, _, arr) => arr.filter(v => v === prev).length >= arr.filter(v => v === curr).length ? prev : curr);
            
            await WeatherSummary.deleteOne({
                city: cityName,
                date: new Date(startOfDay * 1000)
            });

            const summary = new WeatherSummary({
                city: cityName,
                date: new Date(startOfDay * 1000),
                avgTemp,
                maxTemp,
                minTemp,
                dominantWeather,
            });

            await summary.save();
            console.log(`Weather summary for ${cityName} saved.`);
        }
    }
}

async function updateWeeklySummaries() {
    for (const cityName of cities) {
        // Fetch the most recent daily summary for the city
        const dailySummary = await WeatherSummary.findOne({ city: cityName }).sort({ date: -1 }).exec();
        if (!dailySummary) {
            console.log(`No daily summary found for ${cityName}`);
            continue;
        }

        // Prepare the daily summary data to match the WeeklySummary schema
        const newSummary = {
            date: dailySummary.date,
            avgTemp: dailySummary.avgTemp,
            maxTemp: dailySummary.maxTemp,
            minTemp: dailySummary.minTemp,
            dominantWeather: dailySummary.dominantWeather
        };

        // Update the WeeklySummary for the city
        const weeklySummary = await WeeklySummary.findOne({ city: cityName });

        if (!weeklySummary) {
            // If no weekly summary exists, create a new one with the current daily summary
            await WeeklySummary.create({
                city: cityName,
                summaries: [newSummary]
            });
            console.log(`Weekly summary created for ${cityName}.`);
        } else {
            // Add the new daily summary to the summaries array
            weeklySummary.summaries.push(newSummary);

            // Ensure only the last 7 summaries are kept
            if (weeklySummary.summaries.length > 7) {
                weeklySummary.summaries.shift(); // Remove the oldest summary
            }

            try {
                // Save the updated weekly summary
                await weeklySummary.save();
                console.log(`Weekly summary updated for ${cityName}.`);
            } catch (error) {
                console.error(`Error saving weekly summary for ${cityName}:`, error);
            }
        }
    }
}


// Schedule tasks
async function startHourlyWeatherUpdates(){
    const now = new Date();
    const delay = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();
    setTimeout(function () {
        fetchWeatherData();
        setInterval(fetchWeatherData, 60 * 60 * 1000); // Run every hour
    },delay);
}

async function startHourlyCleanup() {
    const now = new Date();
    const delay = 24 * 60 * 60 * 1000 - now.getTime() % (24 * 60 * 60 * 1000); // Delay until midnight
    setTimeout(function(){
        cleanupOldWeatherData();
        setInterval(cleanupOldWeatherData, 24* 60 * 60 * 1000)},delay+10000); // Run every 24 hour
}

async function startHourlySummaryCalculation() {
    const now = new Date();
    const delay = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000 - now.getMilliseconds();

    setTimeout(function(){
        calculateDailySummaries();
        setInterval(calculateDailySummaries, 60 * 60 * 1000)},delay+15000); // Run every hour
}

function startDailyWeeklySummaryUpdate() {
    const now = new Date();
    const delay = 24 * 60 * 60 * 1000 - now.getTime() % (24 * 60 * 60 * 1000); // Delay until midnight
    setTimeout(function () {
        updateWeeklySummaries();
        setInterval(updateWeeklySummaries, 24 * 60 * 60 * 1000); // Run every 24 hours
    },delay+20000);
}

startHourlyWeatherUpdates();
startHourlyCleanup();
startHourlySummaryCalculation();
startDailyWeeklySummaryUpdate();
app.get('/',async(req,res)=>{
    res.json("Connection Successful");
})

app.get('/api/daily-summaries', async (req, res) => {
    const summaries = await WeatherSummary.find({});
    res.json(summaries);
});

app.get('/api/daily-summaries/:city', async (req, res) => {
    const { city } = req.params;
    const summaries = await WeatherSummary.find({ city });
    res.json(summaries);
});

app.get('/api/weekly-summaries', async (req, res) => {
    const summaries = await WeeklySummary.find({});
    res.json(summaries);
});

app.get('/api/weekly-summaries/:city', async (req, res) => {
    const { city } = req.params;
    const weeklySummary = await WeeklySummary.findOne({ city }).populate('summaries');
    if (weeklySummary) {
        res.json(weeklySummary.summaries);
    } else {
        res.status(404).json({ message: 'No weekly summary found for this city' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
