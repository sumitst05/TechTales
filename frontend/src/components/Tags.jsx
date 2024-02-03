import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Tags() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState({ tags: [] });
  const [toggleSuggestions, setToggleSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const suggestionRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    setToggleSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setToggleSuggestions(false);
      setHighlightIndex(-1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setToggleSuggestions(true);
    }
  };

  useEffect(() => {
    const closeSuggestions = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setToggleSuggestions(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const tags = await axios.get(`/api/articles/tags?query=${value}`);
        setSuggestions({ tags: tags.data });
      } catch (error) {
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        console.log(error.message);
      }
    };

    const timer = setTimeout(() => {
      if (value.trim() !== "") {
        fetchSuggestions();
      } else {
        setSuggestions({ tags: [] });
      }
    }, 350);

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setToggleSuggestions(false);
        setHighlightIndex(-1);
      }
    };

    const handleArrowKeys = (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prevIndex) => {
          const totalSuggestions = suggestions.tags.length;
          if (e.key === "ArrowUp") {
            return prevIndex > 0 ? prevIndex - 1 : totalSuggestions - 1;
          } else {
            return (prevIndex + 1) % totalSuggestions;
          }
        });
      }
    };

    window.addEventListener("click", closeSuggestions);
    window.addEventListener("keydown", handleEscapeKey);
    window.addEventListener("keydown", handleArrowKeys);

    return () => {
      window.removeEventListener("click", closeSuggestions);
      window.removeEventListener("keydown", handleEscapeKey);
      window.removeEventListener("keydown", handleArrowKeys);
      clearTimeout(timer);
    };
  }, [toggleSuggestions, value, suggestions.tags.length]);

  return (
    <div className="relative self-center w-full md:w-1/4 mx-auto mt-2">
      <input
        type="text"
        id="search_tags"
        placeholder="Enter tags to filter"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
        className="text-center bg-slate-100 p-1 rounded-lg outline-none outline-violet-700 outline-2 w-full"
      />

      {toggleSuggestions && (
        <div
          className="absolute z-10 w-full bg-slate-100 p-2 mt-2 rounded-lg shadow-lg overflow-auto"
          ref={suggestionRef}
        >
          {suggestions.tags.length > 0 ? (
            suggestions.tags.map((tag, index) => (
              <div
                key={index}
                className={`flex justify-center items-center hover:bg-slate-200 ${
                  highlightIndex === index ? "bg-slate-200" : ""
                }`}
              >
                <p className="font-medium text-slate-500">{tag}</p>
              </div>
            ))
          ) : (
            <p className="flex mt-2 justify-center text-slate-400">
              No tags found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Tags;
