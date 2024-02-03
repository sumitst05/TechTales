import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

function ArticleCard({ article }) {
  const [likedStatus, setLikedStatus] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const likedArticleIdsSet = new Set(currentUser.likedArticles || []);
    setLikedStatus(likedArticleIdsSet.has(article._id));
  }, [article._id, currentUser.likedArticles]);

  const handleLike = async () => {
    const likeCount = article.likes + (likedStatus ? -1 : 1);

    try {
      dispatch(updateUserStart());

      const isAlreadyLiked = likedStatus;

      const updatedLikedArticles = new Set(currentUser.likedArticles);

      if (isAlreadyLiked) {
        updatedLikedArticles.delete(article._id);
      } else {
        updatedLikedArticles.add(article._id);
      }

      const res = await axios.patch(`/api/user/${currentUser._id}`, {
        ...currentUser,
        likedArticles: Array.from(updatedLikedArticles),
      });

      const data = res.data;

      await axios.patch(`/api/articles/${article._id}`, { likes: likeCount });

      dispatch(updateUserSuccess(data));
    } catch (error) {
      error.message = error.response
        ? error.response.data.message
        : error.response.statusText;
      dispatch(updateUserFailure(error.message));
    }

    setLikedStatus(!likedStatus);
  };

  return (
    <div
      className={`flex items-center text-slate-700 hover:scale-105 hover:text-slate-200 bg-slate-200 hover:bg-gradient-to-r from-violet-600 to-indigo-400 rounded-lg px-4 py-4 pb-2 gap-6 w-full`}
    >
      <div className="flex flex-col justify-between 2 mx-2 w-full line-clamp-1">
        <div className="flex gap-2 items-center">
          <img
            src={article.author?.profilePicture}
            alt="profile"
            className="h-6 w-6 rounded-full"
          />
          <p className="font-medium overflow-hidden overflow-ellipsis">
            {article.author ? article.author.username : "Unknown"}
          </p>
        </div>
        <p className="text-2xl font-bold overflow-hidden overflow-ellipsis">
          {article.title}
        </p>
        <div className="flex mt-2 items-center gap-1">
          <img
            src={likedStatus ? "/liked.png" : "/like.png"}
            alt="like"
            className="rounded-full h-5 w-5"
            onClick={handleLike}
          />
          <p className="font-medium">{article.likes}</p>
        </div>
      </div>
      <img
        src={article.coverImage}
        alt="cover-image"
        className="h-16 w-16 flex-shrink-0 rounded-lg bg-slate-200"
      />
    </div>
  );
}

export default ArticleCard;
