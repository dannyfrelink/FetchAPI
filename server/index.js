const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const app = express();
const port = 3001;

app.get("/weather/:region", async (req, res) => {
  try {
    const { region } = req.params;
    const key = process.env.API_KEY;

    await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${key}&q=${region}`
    )
      .then((res) => res.json())
      .then((data) => console.log("testing: ", data));

    res.send(`Hello from NodeJS server: ${region}`);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
