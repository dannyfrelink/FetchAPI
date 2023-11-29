import { List, ListItem, ListItemText, TextField } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useState, useEffect } from "react";

const InputAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(2);
  const [nextPage, setNextPage] = useState(false);
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
        await fetch(
          `http://localhost:3001/suggestions?input=${input}&page=${page}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then((res) => res.json())
          .then(({ count, suggestions }) => {
            setSuggestions(suggestions);
            setNextPage(count);
          });
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

  const handlePagination = async (e) => {
    let targetElement = e.target;
    if (e.target.tagName !== "li") {
      targetElement = e.target.closest("li");
    }

    if (targetElement.id === "prevPage") {
      setPage(page - 1);
    } else {
      setPage(page + 1);
    }

    await handleSearch();
  };

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
              <ListItem onClick={(e) => console.log(e.target)} button>
                <ListItemText
                  primary={city.label.split(",")[0]}
                  secondary={city.label.split(", ")[1]}
                />
              </ListItem>
            </div>
          ))}
        </List>
      )}
      {suggestions.length > 0 && (
        <nav className="flex justify-between w-full z-10 list-none mb-5 [&>li]:flex [&>li]:items-center">
          <li id="prevPage" onClick={handlePagination}>
            {page !== 1 && <ArrowBackIosNewIcon fontSize="small" />}
          </li>
          <li>{`${page}`}</li>
          <li id="nextPage" onClick={handlePagination}>
            {nextPage && <ArrowForwardIosIcon fontSize="small" />}
          </li>
        </nav>
      )}
    </div>
  );
};

export default InputAutocomplete;
