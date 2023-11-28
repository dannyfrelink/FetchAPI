import { Autocomplete, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";

const InputAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  let timeoutId;

  const debounce = (func, delay) => {
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const handleSearch = debounce(async (input) => {
    try {
      await fetch(`http://localhost:3001/suggestions?input=${input}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(({ suggestions }) => setSuggestions(suggestions));
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
    }
  }, 500);

  const capitalizeFirstLetter = (input) => {
    return input
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    setStatus(!status);
  }, [suggestions]);

  return (
    <div>
      {/* <input
        className="block w-full border-[1px] border-black border-solid rounded p-1"
        type="text"
        placeholder="Type a city name..."
        value={query}
        onChange={(e) => setQuery(capitalizeFirstLetter(e.target.value))}
        onKeyUp={() => handleSearch(query)}
        onKeyDown={() => clearTimeout(timeoutId)}
      /> */}
      <Autocomplete
        value={query}
        disablePortal
        id="combo-box-demo"
        options={suggestions}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => setQuery(capitalizeFirstLetter(e.target.value))}
            onKeyUp={() => handleSearch(query)}
            onKeyDown={() => clearTimeout(timeoutId)}
            label="Type a city name"
          />
        )}
      />
      <ul>
        {suggestions.map((city) => (
          <li key={city.id}>{city.label}</li>
        ))}
      </ul>
    </div>
  );
};

export default InputAutocomplete;
