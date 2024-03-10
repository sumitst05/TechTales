import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

function Bookmarks() {
  const mode = import.meta.env.VITE_MODE;

  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(
    parseInt(localStorage.getItem("bookmarkPage")) || 1,
  );
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [articleUpdate, setArticleUpdate] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        if (!articleUpdate) {
          setLoading(true);
        }
        const res = await axios.get(
          mode === "DEV"
            ? `/api/user/bookmarks/?page=${page}&pageSize=${pageSize}`
            : `https://tech-tales-api.vercel.app/api/user/bookmarks/?page=${page}&pageSize=${pageSize}`,
          { withCredentials: true },
        );

        const bookmarks = res.data.bookmarks;

        setArticles([...bookmarks].reverse());
        setTotalPages(Math.ceil(res.data.totalArticles / pageSize));
      } catch (error) {
        error.message = error.response
          ? error.response.data.message
          : error.response.statusText;
        console.log(error.message);
      } finally {
        setLoading(false);
        setArticleUpdate(false);
      }
    };

    fetchArticles();
  }, [page, pageSize, currentUser]);

  useEffect(() => {
    localStorage.setItem("bookmarkPage", page.toString());
  }, [page]);

  return (
    <div className="flex flex-col justify-between mt-16 max-w-6xl mx-auto p-3 gap-4 select-none overflow-hidden">
      <h1 className="text-4xl text-center font-semibold p-3 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
        Bookmarks
      </h1>

      <div className="flex-grow w-full md:max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading && <Loader />}
        {!loading &&
          articles.map((article) => (
            <ArticleCard
              key={article._id}
              article={article}
              setArticleUpdate={setArticleUpdate}
            />
          ))}
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

export default Bookmarks;
