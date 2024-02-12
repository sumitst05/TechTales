import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";

function Article() {
  const { articleId } = useParams();
  const [article, setArticle] = useState({});
  const [readTime, setReadTime] = useState(0);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`/api/articles/${articleId}`);

        setReadTime(Math.ceil(res.data.content.split(" ").length / 200));

        setArticle(res.data);
      } catch (error) {
        error.message = error.response
          ? error.response.message
          : error.response.statusText;
        console.log(error.message);
      }
    };

    fetchArticle();
  }, []);

  function handleToggleTags() {
    setShowAllTags(!showAllTags);
  }

  return (
    <div className="article flex flex-col mt-16 max-w-3xl mx-auto p-2 gap-4">
      <p className="mt-6 font-serif font-bold text-4xl text-slate-900">
        {article.title}
      </p>
      <div className="flex items-center gap-1 select-none">
        <img
          src={article.author?.profilePicture}
          alt="profile"
          className="w-6 h-6 rounded-full"
        />
        <p className="text-slate-700 text-xl font-serif font-medium">
          {article.author ? article.author.username : "Unknown"}
        </p>
        <p className="font-light mt-1">•</p>
        <p className="text-slate-700 text-sm font-normal mt-1">
          {" " + readTime + " "}
          {readTime > 1 ? "minutes read" : "minute read"}
        </p>
      </div>

      <div className="flex flex-wrap items-center w-full gap-4 overflow-x-auto">
        {showAllTags
          ? article.tags &&
            article.tags.map((tag, index) => (
              <div key={index}>
                <p className="px-2 py-1 bg-slate-200 text-slate-600 text-sm rounded-lg">
                  {tag}
                </p>
              </div>
            ))
          : article.tags &&
            article.tags.slice(0, 5).map((tag, index) => (
              <div key={index}>
                <p className="px-2 py-1 bg-slate-200 text-slate-600 text-sm rounded-lg">
                  {tag}
                </p>
              </div>
            ))}

        {article.tags && article.tags.length > 5 && (
          <span
            className="text-sm text-slate-600 -mx-2 cursor-pointer"
            onClick={handleToggleTags}
          >
            {showAllTags ? "...less" : "...more"}
          </span>
        )}
      </div>

      <div className="flex justify-center items-center font-serif text-justify text-xl">
        <ReactQuill
          theme="bubble"
          modules={{
            toolbar: false,
          }}
          value={article.content}
          readOnly={true}
        />
      </div>
    </div>
  );
}

export default Article;
