import React, { useState, useEffect } from "react";

const InputAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const debounce = (func, delay) => {
    let timeoutId;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = debounce(async (input) => {
    try {
      const response = await fetch(
        `http://localhost:3001/suggestions?input=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then(({ suggestions }) => setSuggestions(suggestions));
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  }, 500);

  const delayedSearch = () => {
    handleSearch(query);
  };

  return (
    <div>
      <input
        className="block border-[1px] border-black border-solid rounded p-1"
        type="text"
        placeholder="Type a city name..."
        value={query}
        onChange={handleInputChange}
        onKeyUp={delayedSearch}
      />
      <ul>
        {suggestions.map((city) => (
          <li key={city.geonameId}>
            {city.toponymName}, {city.countryName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InputAutocomplete;
