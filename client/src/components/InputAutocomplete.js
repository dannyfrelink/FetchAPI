import {
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
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
      if (query === "") {
        setSuggestions([]);
      } else {
        await fetch(`http://localhost:3001/suggestions?input=${input}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then(({ suggestions }) => setSuggestions(suggestions));
      }
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
    <div className="flex flex-col h-screen pt-7">
      <TextField
        className="block w-full"
        value={query}
        onChange={(e) => setQuery(capitalizeFirstLetter(e.target.value))}
        onKeyUp={() => handleSearch(query)}
        onKeyDown={() => clearTimeout(timeoutId)}
        label="Type a city name"
      />
      {suggestions.length > 0 && (
        <List
          className="flex-1 overflow-y-scroll !py-0 !my-5 [&>div:not(:last-of-type)]:mb-2"
          component="nav"
          aria-label="city suggestions"
        >
          {suggestions.map((city) => (
            <div className="bg-[#00A1E4] rounded" key={city.id}>
              <ListItem button>
                <ListItemText
                  primary={city.label.split(",")[0]}
                  secondary={city.label.split(", ")[1]}
                />
              </ListItem>
            </div>
          ))}
        </List>
      )}
    </div>
  );
};

export default InputAutocomplete;
