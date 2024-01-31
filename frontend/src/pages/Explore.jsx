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
    <div className="flex flex-col mt-16 max-w-6xl mx-auto p-4 gap-8 select-none">
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
      <div className="flex justify-center mx-auto w-full">
        <div className="relative w-full md:max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <div
              key={article._id}
              className="flex items-center text-slate-700 hover:scale-105 hover:text-slate-200 bg-slate-200 hover:bg-gradient-to-r from-violet-600 to-indigo-400 rounded-lg px-4 py-4 pb-2 gap-6 w-full"
            >
              <div className="flex flex-col justify-between 2 mx-2 w-full line-clamp-1">
                <div className="flex gap-2 items-center">
                  <img
                    src={article.author && article.author.profilePicture}
                    alt="profile"
                    className="h-6 w-6 rounded-full"
                  />
                  <p className="font-medium overflow-hidden overflow-ellipsis">
                    {article.author ? article.author.username : "Unknown"}
                  </p>
                </div>
                <p className="text-2xl font-bold overflow-hidden overflow-ellipsis">
                  {article.title}
                </p>
                <div className="flex mt-2">
                  <img
                    src="../../public/like.png"
                    alt="like"
                    className="rounded-full w-5 h-5"
                  />
                </div>
              </div>
              <img
                src={article.coverImage}
                className="flex h-16 w-16 flex-shrink-0 rounded-lg bg-slate-200 ml-10"
                alt="cover-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
