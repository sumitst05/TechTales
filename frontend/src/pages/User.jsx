import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ArticleCard from "../components/ArticleCard";
import Loader from "../components/Loader";

function User() {
  const mode = import.meta.env.VITE_MODE;

  const { slug } = useParams();
  const userId = slug.split("-").pop();

  const [user, setUser] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [articleUpdate, setArticleUpdate] = useState(false);
  const [followersSelected, setFollowersSelected] = useState(false);
  const [followingSelected, setFollowingSelected] = useState(false);
  const [articlesSelected, setArticlesSelected] = useState(true);

  const { currentUser } = useSelector((state) => state.user);

  function handleSelect(tab) {
    switch (tab) {
      case "followers":
        setFollowersSelected(true);
        setFollowingSelected(false);
        setArticlesSelected(false);
        break;
      case "following":
        setFollowersSelected(false);
        setFollowingSelected(true);
        setArticlesSelected(false);
        break;
      case "articles":
        setFollowersSelected(false);
        setFollowingSelected(false);
        setArticlesSelected(true);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          mode === "DEV"
            ? `/api/user/${userId}`
            : `https://tech-tales-api.vercel.app/api/user/${userId}`,
        );

        setUser(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchArticles = async () => {
      if (!articleUpdate) {
        setLoading(true);
      } else {
        setLoading(false);
      }
      try {
        const res = await axios.get(
          mode === "DEV"
            ? `/api/articles/myarticles/?userId=${userId}`
            : `https://tech-tales-api.vercel.app/api/articles/myarticles/?userId=${userId}`,
          { withCredentials: true },
        );

        setArticles(res.data.articles);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };

    fetchUser();
    fetchArticles();
  }, [userId, currentUser]);

  return (
    <div className="p-3 max-w-6xl mx-auto mt-16">
      <div className="flex flex-col items-center select-none">
        <img
          src={user.profilePicture}
          alt="profile-pic"
          className="h-32 w-32 object-cover rounded-full shadow-indigo-700 shadow-lg"
        />
        <span className="text-4xl text-slate-700 font-semibold mt-3">
          {user.username}
        </span>
        <p className="mt-2 text-sm font-semibold text-center text-zinc-600">
          {user?.bio}
        </p>
      </div>

      <ul className="flex justify-center items-center gap-6 select-none mt-6 ">
        <li
          className={
            followersSelected
              ? "text-xl text-indigo-600 font-bold bg-zinc-300 p-2 rounded-lg hover:shadow-md hover:shadow-indigo-600"
              : "text-lg text-violet-800 font-bold bg-zinc-300 p-2 rounded-md shadow shadow-indigo-800 hover:scale-125 hover:shadow-md hover:shadow-indigo-600"
          }
          onClick={() => handleSelect("followers")}
        >
          Followers
        </li>
        <li
          className={
            followingSelected
              ? "text-xl text-indigo-600 font-bold bg-zinc-300 p-2 rounded-lg hover:shadow-md hover:shadow-indigo-600"
              : "text-lg text-violet-800 font-bold bg-zinc-300 p-2 rounded-md shadow shadow-indigo-800 hover:scale-125 hover:shadow-md hover:shadow-indigo-600"
          }
          onClick={() => handleSelect("following")}
        >
          Following
        </li>
        <li
          className={
            articlesSelected
              ? "text-xl text-indigo-600 font-bold bg-zinc-300 p-2 rounded-lg hover:shadow-md hover:shadow-indigo-600"
              : "text-lg text-violet-800 font-bold bg-zinc-300 p-2 rounded-md shadow shadow-indigo-800 hover:scale-125 hover:shadow-md hover:shadow-indigo-600"
          }
          onClick={() => handleSelect("articles")}
        >
          Articles
        </li>
      </ul>

      {followersSelected ? (
        <p className="text-lg font-bold text-center text-gray-700 mt-4">
          Followers
        </p>
      ) : followingSelected ? (
        <p className="text-lg font-bold text-center text-gray-700 mt-4">
          Following
        </p>
      ) : articlesSelected ? (
        <div className="flex-grow w-full md:max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
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
      ) : (
        ""
      )}
    </div>
  );
}

export default User;
