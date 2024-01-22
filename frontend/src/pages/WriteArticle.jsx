import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  createArticleFailure,
  updateArticleStart,
  updateArticleSuccess,
} from "../redux/article/articleSlice";
import PublishArticle from "../components/PublishArticle";

import { editorStyle, modules, formats } from "../editorConfig";

function WriteArticle() {
  const dispatch = useDispatch();
  const [showPublish, setShowPublish] = useState(false);
  const { currentArticle, loading, error } = useSelector(
    (state) => state.article,
  );

  useEffect(() => {
    dispatch(createArticleFailure(false));
  }, [dispatch]);

  function handleTitleChange(e) {
    const title = e.target.value;
    dispatch(updateArticleStart());
    dispatch(updateArticleSuccess({ ...currentArticle, title }));
  }
  function handleEditorChange(content) {
    dispatch(updateArticleStart());
    dispatch(updateArticleSuccess({ ...currentArticle, content }));
  }

  function handlePublish() {
    setShowPublish(!showPublish);
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="p-8 flex flex-col justify-center items-center gap-4 mt-12">
        <input
          type="text"
          placeholder="TITLE"
          value={currentArticle ? currentArticle.title : ""}
          onChange={handleTitleChange}
          className="relative text-center outline-none font-bold text-4xl font-serif text-gray-800 w-2/3 placeholder-gray-500"
        />
        <ReactQuill
          theme="snow"
          style={editorStyle}
          value={currentArticle ? currentArticle.content : ""}
          modules={modules}
          formats={formats}
          onChange={handleEditorChange}
          placeholder="Write something amazing..."
        />
        <button
          type="submit"
          onClick={handlePublish}
          disabled={loading}
          className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Publishing..." : "Publish"}
        </button>

        {showPublish && <PublishArticle setShowPublish={setShowPublish} />}

        <div>
          <p className="text-red-700">
            {error ? error || "Something went wrong!" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WriteArticle;
