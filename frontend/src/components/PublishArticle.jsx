import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createArticleStart,
  createArticleSuccess,
  createArticleFailure,
  updateArticleStart,
  updateArticleSuccess,
  resetCurrentArticle,
} from "../redux/article/articleSlice";

function PublishArticle({ setShowPublish }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { currentArticle } = useSelector((state) => state.article);
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  function handleTags(e) {
    setTagInput(e.target.value);
  }
  function handleAddTag(tag) {
    if (tag.trim() !== "") {
      setSelectedTags((prevTags) => {
        const index = prevTags.indexOf(tag);

        if (index !== -1) {
          return prevTags;
        }

        const newTags = [...prevTags, tag];

        return newTags;
      });
      setTagInput("");
    }
  }
  function handleRemoveTag(tag) {
    setSelectedTags((prevTags) => {
      const index = prevTags.indexOf(tag);

      if (index !== -1) {
        const newTags = [...prevTags];
        newTags.splice(index, 1);

        return newTags;
      }

      return prevTags;
    });
  }

  async function handleProceed(e) {
    e.preventDefault();
    dispatch(resetCurrentArticle());

    try {
      dispatch(createArticleStart());

      const articleData = {
        author: currentArticle ? currentUser._id : "",
        title: currentArticle ? currentArticle.title : "",
        content: currentArticle ? currentArticle.content : "",
        tags: selectedTags,
      };

      const res = await axios.post("/api/articles", articleData, {
        withCredentials: true,
      });
      const data = res.data;

      dispatch(createArticleSuccess(data));

      navigate("/articles");

      dispatch(resetCurrentArticle());

      setShowPublish(false);
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(createArticleFailure(error.message));
    }
  }

  return (
    <div className="top-0 left-0 fixed bg-slate-50 bg-opacity-50 w-full h-full flex justify-center items-center">
      <div className="p-6 bg-gray-100 shadow-2xl fixed z-15 items-center w-1/3">
        <h2 className="text-lg text-center font-semibold p-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-indigo-600">
          Enter Tags
        </h2>
        <form className="flex flex-col items-center gap-2">
          <input
            id="tag"
            className="p-1 bg-slate-50 rounded-lg text-center text-zinc-600 outline-none outline-violet-700"
            placeholder="Tags"
            onChange={handleTags}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Spacebar") {
                e.preventDefault();
                handleAddTag(tagInput);
              }
            }}
            value={tagInput}
            autoComplete="off"
          />
          <div className="flex justify-center items-center flex-wrap gap-2 max-h-40 overflow-y-auto mt-4">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="bg-violet-300 rounded-lg px-2 py-1 flex items-center overflow-hidden select-none gap-2"
              >
                <span
                  className="font-extrabold text-xs text-indigo-700"
                  onClick={() => handleRemoveTag(tag)}
                >
                  X
                </span>
                <span className="font-medium text-violet-600">{tag}</span>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold w-auto px-4 py-2 mt-2 rounded-lg hover:opacity-95 disabled:opacity-80"
            onClick={handleProceed}
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublishArticle;
