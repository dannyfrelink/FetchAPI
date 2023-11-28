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
      `http://api.geonames.org/searchJSON?name_startsWith=${input}&username=dannyfrelink&maxRows=100`
    )
      .then((res) => res.json())
      .then(({ geonames }) => {
        const filteredGeonames = geonames.filter((geoname) => {
          const geoName = geoname.toponymName.toLowerCase();
          const query = input.toLowerCase();

          for (let i = 0; i < query.length; i++) {
            // If the characters don't match, return false
            if (geoName.charAt(i) !== query.charAt(i)) {
              return false;
            }
          }
          return true;
        });

        const typedGeonames = filteredGeonames.map((geoname) => {
          return {
            label: `${geoname.toponymName}, ${geoname.adminName1} (${geoname.countryName})`,
            id: geoname.geonameId,
          };
        });

        let reducedGeonames = [];
        let uniqueObject = {};

        for (let i in typedGeonames) {
          let objTitle = typedGeonames[i]["label"];
          uniqueObject[objTitle] = typedGeonames[i];
        }

        for (i in uniqueObject) {
          reducedGeonames.push(uniqueObject[i]);
        }

        res.json({ suggestions: reducedGeonames.splice(0, 10) });
      });
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
