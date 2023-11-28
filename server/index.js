const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const app = express();
const port = 3001;
const cors = require("cors");

app.use(cors());

app.get("/suggestions", async (req, res) => {
  try {
    const { input } = req.query;

    await fetch(
      `http://api.geonames.org/searchJSON?name_startsWith=${input}&username=dannyfrelink&maxRows=1000`
    )
      .then((res) => res.json())
      .then(({ geonames }) => res.json({ suggestions: geonames }));
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/weather/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const key = process.env.WEATHER_API_KEY;

    const forecastWeather = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${region}&days=7`
    ).then((res) => res.json());

    res.status(200).json({ forecastWeather });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
