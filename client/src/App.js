import { useEffect, useState } from "react";
import "./App.css";
import InputAutocomplete from "./components/InputAutocomplete";

function App() {
  const [query, setQuery] = useState("");
  const [forecast, setForecast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:3001/weather/${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(({ forecastWeather }) => setForecast(forecastWeather));
  };

  return (
    <div className="w-10/12 mx-auto mt-7">
      <InputAutocomplete />
    </div>
  );
}

export default App;
