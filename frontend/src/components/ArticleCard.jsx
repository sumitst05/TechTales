import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

function ArticleCard({ article }) {
  const [likedStatus, setLikedStatus] = useState(false);
  const [bookmarkedStatus, setBookmarkedStatus] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const publishDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(article.createdAt));

  useEffect(() => {
    const likedArticleIdsSet = new Set(currentUser.likedArticles || []);
    setLikedStatus(likedArticleIdsSet.has(article._id));

    const bookmarkedArticleIdsSet = new Set(
      currentUser.bookmarkedArticles || [],
    );
    setBookmarkedStatus(bookmarkedArticleIdsSet.has(article._id));
  }, [article._id, currentUser.likedArticles, currentUser.bookmarkedArticles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinkCopied(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [linkCopied]);

  async function handleLike(e) {
    e.preventDefault();
    e.stopPropagation();

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
  }

  async function handleBookmark(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      dispatch(updateUserStart());

      const isAlreadyBookmarked = bookmarkedStatus;
      const updatedBookmarkedArticles = new Set(currentUser.bookmarkedArticles);

      if (isAlreadyBookmarked) {
        updatedBookmarkedArticles.delete(article._id);
      } else {
        updatedBookmarkedArticles.add(article._id);
      }

      const res = await axios.patch(`/api/user/${currentUser._id}`, {
        ...currentUser,
        bookmarkedArticles: Array.from(updatedBookmarkedArticles),
      });
      const data = res.data;

      dispatch(updateUserSuccess(data));
    } catch (error) {
      error.message = error.response
        ? error.response.data.message
        : error.response.statusText;
      dispatch(updateUserFailure(error.message));
    }

    setBookmarkedStatus(!bookmarkedStatus);
  }

  async function handleCopyLink(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(
        location.origin + "/article/" + article._id,
      );
      setLinkCopied(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Link to={`/article/${article._id}`}>
      <div
        className={`flex items-center text-slate-700 hover:scale-105 hover:text-slate-200 hover:bg-gradient-to-r hover:from-violet-600 hover:to-indigo-400 rounded-lg px-4 w-full h-32 relative bg-gradient-to-r from-zinc-200 to-slate-100 transition-transform duration-300`}
      >
        {linkCopied && (
          <div className="absolute top-0 right-0 z-10 flex items-center mt-1 mr-1 px-2 bg-indigo-500 opacity-60 rounded">
            <span className="text-white font-semibold">
              Link copied to clipboard!
            </span>
          </div>
        )}
        <div className="flex flex-col justify-between gap-2 w-4/5">
          <div className="flex gap-2 items-center">
            <img
              src={article.author?.profilePicture}
              alt="profile"
              className="h-6 w-6 rounded-full"
            />
            <p className="font-medium truncate">
              {article.author ? article.author.username : "Unknown"}
            </p>

            <p className="font-light">•</p>

            <p className="text-sm truncate">{publishDate}</p>

            <p className="font-light">•</p>

            <p className="text-sm truncate">
              {Math.ceil(article.content.split(" ").length / 200) + " "}
              {Math.ceil(article.content.split(" ").length / 200) > 1
                ? "minutes read"
                : "minute read"}
            </p>
          </div>
          <p className="text-2xl font-bold truncate">
            {article.title}
            <br />
          </p>
          <div className="flex mt-2 items-center gap-4">
            <div className="flex items-center gap-1">
              <img
                src={likedStatus ? "/liked.png" : "/like.png"}
                alt="like"
                className="h-5 w-5 hover:scale-125"
                onClick={handleLike}
              />
              <p className="font-medium">{article.likes}</p>
            </div>
            <img
              src={bookmarkedStatus ? "/bookmarked.png" : "/bookmark.png"}
              alt="bookmark"
              className="h-5 w-5 hover:scale-125"
              onClick={handleBookmark}
            />
            <img
              src={"/link.png"}
              alt="copy-link"
              className="h-7 w-7 hover:scale-125"
              onClick={handleCopyLink}
            />
          </div>
        </div>
        <img
          src={article.coverImage}
          alt="cover-image"
          className="h-16 w-16 absolute right-4 flex-shrink-0 rounded-lg bg-slate-200"
        />
      </div>
    </Link>
  );
}

export default ArticleCard;
