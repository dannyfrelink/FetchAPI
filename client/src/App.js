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
    <div className="w-11/12 mx-auto mt-7">
      {!forecast ? (
        <form method="GET" onSubmit={handleSubmit}>
          <input
            className="block border-[1px] border-black border-solid"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button>Search Weather</button>

          {/* <InputAutocomplete /> */}
        </form>
      ) : (
        <div>{forecast.current.condition.text}</div>
      )}
    </div>
  );
}

export default App;
