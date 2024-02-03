import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";
import Tags from "../components/Tags";

function Explore() {
  const [articles, setArticles] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("/api/articles");
        setArticles(res.data);
      } catch (error) {
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        console.log(error.message);
      }
    };

    fetchArticles();
  }, [currentUser]);

  return (
    <div className="flex flex-col mt-16 max-w-6xl mx-auto p-4 gap-8 select-none">
      <Tags />

      <div className="flex justify-center mx-auto w-full">
        <div className="relative w-full md:max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Explore;
