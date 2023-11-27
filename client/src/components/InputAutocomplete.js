import React, { useState, useEffect } from "react";

const InputAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(
          `http://api.weatherapi.com/v1/search.json?key=${process.env.REACT_APP_API_KEY}&q=${query}`
        )
          .then((res) => res.json())
          .then((data) => console.log(data));
        // setSuggestions(response.data.list);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    };

    if (query.trim() !== "") {
      fetchCities();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type a city name..."
        value={query}
        onChange={handleInputChange}
      />
      <ul>
        {suggestions.map((city) => (
          <li key={city.id}>
            {city.name}, {city.sys.country}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InputAutocomplete;
