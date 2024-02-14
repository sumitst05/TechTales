import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

function YourArticles() {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("yourArticlesPage")) || 1,
  );
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/articles/myarticles/?userId=${currentUser._id}&page=${page}&pageSize=${pageSize}`,
        );
        setArticles(res.data.articles);
        setTotalPages(Math.ceil(res.data.totalArticles / pageSize));
      } catch (error) {
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [page, pageSize, currentUser]);

  useEffect(() => {
    localStorage.setItem("yourArticlesPage", page.toString());
  }, [page]);

  return (
    <div className="flex flex-col justify-between mt-16 max-w-6xl mx-auto p-3 select-none overflow-hidden">
      <h1 className="text-4xl text-center font-semibold p-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
        Your Articles
      </h1>
      <div className="flex justify-center mx-auto w-full mt-2">
        <div className="relative w-full md:max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <Loader />}
          {!loading &&
            articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        loading={loading}
      />
    </div>
  );
}

export default YourArticles;
