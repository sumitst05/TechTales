import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";

function Article() {
  const { articleId } = useParams();
  const [article, setArticle] = useState({});
  const [readTime, setReadTime] = useState(0);

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

  return (
    <div className="article flex flex-col mt-16 max-w-3xl mx-auto p-2 gap-4">
      <p className="mt-6 font-serif font-bold text-4xl text-slate-900">
        {article.title}
      </p>
      <div className="flex items-center gap-1">
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
          {readTime + " "}
          {readTime > 1 ? "minutes read." : "minute read."}
        </p>
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
