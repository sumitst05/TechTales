import { useState, useEffect, useRef } from "react";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

function Explore() {
  const [tagInput, setTagInput] = useState("");
  const [suggestions, setSuggestions] = useState({ tags: [] });
  const [toggleSuggestions, setToggleSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [articles, setArticles] = useState([]);
  const [likedStatus, setLikedStatus] = useState({});

  const suggestionRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("/api/articles");
        setArticles(res.data);

        const likedArticleIds = currentUser.likedArticles || [];

        const initialLikedStatus = res.data.reduce((acc, article) => {
          acc[article._id] = likedArticleIds.includes(article._id);
          return acc;
        }, {});
        setLikedStatus(initialLikedStatus);
      } catch (error) {
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        console.log(error.message);
      }
    };

    fetchArticles();
  }, [currentUser]);

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
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        console.log(error.message);
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

  async function handleLike(articleId) {
    const index = articles.findIndex((article) => article._id === articleId);
    const likeCount = articles[index].likes + (likedStatus[articleId] ? -1 : 1);

    if (index !== -1) {
      try {
        dispatch(updateUserStart());

        const isAlreadyLiked = currentUser.likedArticles.includes(articleId);

        const updatedLikedArticles = isAlreadyLiked
          ? currentUser.likedArticles.filter((id) => id !== articleId)
          : [...currentUser.likedArticles, articleId];

        const res = await axios.patch(`/api/user/${currentUser._id}`, {
          ...currentUser,
          likedArticles: updatedLikedArticles,
        });
        const data = res.data;

        await axios.patch(`/api/articles/${articleId}`, { likes: likeCount });

        dispatch(updateUserSuccess(data));
      } catch (error) {
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        dispatch(updateUserFailure(error.message));
      }

      setArticles((prevArticles) => {
        const updatedArticles = [...prevArticles];
        updatedArticles[index] = {
          ...updatedArticles[index],
          likes: likeCount,
        };

        return updatedArticles;
      });

      setLikedStatus((prevLikedStatus) => ({
        ...prevLikedStatus,
        [articleId]: !prevLikedStatus[articleId],
      }));
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
            <ArticleCard
              key={article._id}
              article={article}
              likedStatus={likedStatus}
              handleLike={handleLike}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
