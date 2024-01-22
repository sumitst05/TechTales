import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createArticleStart,
  createArticleSuccess,
  createArticleFailure,
  resetCurrentArticle,
} from "../redux/article/articleSlice";

function PublishArticle({ setShowPublish }) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const { currentArticle, loading } = useSelector((state) => state.article);
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
      <div className="p-6 bg-gray-100 shadow-2xl fixed z-15 items-center md:w-1/3">
        <img
          alt="close"
          src="../../assets/close.png"
          className="absolute w-5 h-5 top-2 right-2 hover:bg-zinc-300 cursor-pointer rounded-full"
          onClick={() => setShowPublish(false)}
        />
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
                className="bg-violet-300 rounded-lg pl-1 px-2 flex items-center overflow-hidden select-none gap-1"
              >
                <img
                  alt="close"
                  src="../../assets/close.png"
                  className="w-4 h-4 hover:bg-zinc-300 cursor-pointer rounded-full"
                  onClick={() => handleRemoveTag(tag)}
                />
                <span className="font-medium text-violet-600">{tag}</span>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-center font-semibold w-32 px-4 py-2 mt-2 rounded-lg hover:opacity-95 disabled:opacity-80"
            onClick={handleProceed}
          >
            {loading ? "Proceeding..." : "Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PublishArticle;
