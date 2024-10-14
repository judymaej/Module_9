import express from 'express';
import WeatherService from '../../service/weatherService.js';
import HistoryService from '../../service/historyService.js'; // Ensure this import is correct

const router = express.Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }
  try {
    // GET weather data from city name using WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // Save city to search history using HistoryService
    const savedCity = await HistoryService.saveCity(city, weatherData);

    // Respond with weather data and saved city info
    return res.status(200).json({ weatherData, savedCity });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving weather data', error });
  }
});

export default router;
