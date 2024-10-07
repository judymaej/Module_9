const express = require("express");
const fs = require("fs");
const axios = require("axios");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Serve index.html for all routes
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// GET weather search history
app.get("/api/weather/history", (req, res) => {
  fs.readFile("searchHistory.json", "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading history" });
    res.json(JSON.parse(data));
  });
});

// POST to get weather and save city
app.post("/api/weather", async (req, res) => {
  const cityName = req.body.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    // Fetch city coordinates from OpenWeather API
    const geoResponse = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`
    );
    const { lat, lon } = geoResponse.data[0];

    // Fetch 5-day forecast
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    const weatherData = weatherResponse.data;
    const city = {
      id: uuidv4(),
      name: cityName,
      weather: weatherData,
    };

    // Save the city to search history
    fs.readFile("searchHistory.json", "utf8", (err, data) => {
      const history = data ? JSON.parse(data) : [];
      history.push(city);
      fs.writeFile(
        "searchHistory.json",
        JSON.stringify(history, null, 2),
        (err) => {
          if (err)
            return res.status(500).json({ message: "Error saving history" });
          res.json(city);
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching weather data" });
  }
});
