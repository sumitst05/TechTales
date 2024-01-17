import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  createArticleStart,
  createArticleSuccess,
  createArticleFailure,
  updateArticleStart,
  updateArticleSuccess,
} from "../redux/user/articleSlice";
import { useNavigate } from "react-router-dom";

function WriteArticle() {
  const editorStyle = {
    width: "80%",
    border: "1px solid #ccc",
    borderRadius: "8px",
  };
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["image"],
    ],
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "align",
    "bullet",
    "link",
    "image",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentArticle, loading, error } = useSelector(
    (state) => state.article,
  );

  useEffect(() => {
    dispatch(createArticleFailure(""));
  }, [dispatch]);

  function handleTitleChange(e) {
    dispatch(updateArticleStart());
    dispatch(
      updateArticleSuccess({ ...currentArticle, title: e.target.value }),
    );
  }
  function handleEditorChange(content) {
    dispatch(updateArticleStart());
    dispatch(updateArticleSuccess({ ...currentArticle, content }));
  }

  async function handlePublish(e) {
    e.preventDefault();

    try {
      dispatch(createArticleStart());

      const articleData = {
        title: currentArticle.title,
        content: currentArticle.content,
      };

      const res = await axios.post("/api/articles", articleData, {
        withCredentials: true,
      });
      const data = res.data;

      dispatch(createArticleSuccess(data));

      navigate("/articles");
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(createArticleFailure(error.message));
    }
  }

  return (
    <div className="p-8 flex flex-col justify-center items-center gap-4">
      <input
        type="text"
        placeholder="TITLE"
        value={currentArticle.title}
        onChange={handleTitleChange}
        className="relative text-center outline-none font-bold text-4xl font-serif text-gray-800 w-2/3 placeholder-gray-500"
      />
      <ReactQuill
        theme="snow"
        style={editorStyle}
        value={currentArticle.content}
        modules={modules}
        formats={formats}
        onChange={handleEditorChange}
        placeholder="Write something amazing..."
      />
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
      >
        {loading ? "Publishing..." : "Publish"}
      </button>

      <div>
        <p className="text-red-700 mt-5">
          {error ? error || "Something went wrong!" : ""}
        </p>
      </div>
    </div>
  );
}

export default WriteArticle;
