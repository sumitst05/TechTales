import { useState, useEffect, useRef } from "react";
import axios from "axios";

function Explore() {
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState({ tags: [] });
  const [toggleSuggestions, setToggleSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [articles, setArticles] = useState([]);

  const suggestionRef = useRef(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("/api/articles");
        setArticles(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const closeSuggestions = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setToggleSuggestions(false);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const tags = await axios.get(`/api/articles/tags?query=${tagInput}`);
        setSuggestions({ tags: tags.data });
      } catch (error) {
        console.log(error);
      }
    };

    const timer = setTimeout(() => {
      if (tagInput.trim() !== "") {
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
  }, [toggleSuggestions, tagInput, suggestions.tags.length]);

  function handleChange(e) {
    setTagInput(e.target.value);
    setToggleSuggestions(true);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setToggleSuggestions(false);
      setHighlightIndex(-1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setToggleSuggestions(true);
    }
  }

  return (
    <div className="flex flex-col mt-16 mx-auto py-4 px-8 gap-8">
      <div className="relative self-center w-full md:w-1/4 mx-auto mt-2">
        {/* Filter Articles by Tags */}
        <input
          type="text"
          id="search_tags"
          placeholder="Enter tags to filter"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={tagInput}
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
      {/* Render articles */}
      <div className="flex justify-center mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-8">
          {articles.map((article) => (
            <div
              key={article._id}
              className="flex bg-slate-200 rounded-lg p-2 gap-6"
            >
              <img
                src={article.coverImage}
                className="h-20 w-20 flex-shrink-0 rounded-lg"
                alt="cover-image"
              />
              <div className="flex flex-col justify-between overflow-hidden mx-2">
                <p className="text-slate-700 text-2xl font-semibold">
                  {article.title}
                </p>
                <p className="text-slate-600 text-lg">
                  Author: {article.author ? article.author.username : "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
