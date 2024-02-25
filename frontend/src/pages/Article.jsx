import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

function Article() {
  const { slug } = useParams();
  const [article, setArticle] = useState({});
  const [readTime, setReadTime] = useState(0);
  const [showAllTags, setShowAllTags] = useState(false);
  const [likedStatus, setLikedStatus] = useState(false);
  const [bookmarkedStatus, setBookmarkedStatus] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [lastLikeClickTime, setLastLikeClickTime] = useState(0);
  const [lastBookmarkClickTime, setLastBookmarkClickTime] = useState(0);
  const [readOnly, setReadOnly] = useState(true);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const publishDate = article.createdAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(article.createdAt))
    : "";

  useEffect(() => {
    const likedArticleIdsSet = new Set(currentUser.likedArticles || []);
    setLikedStatus(likedArticleIdsSet.has(article._id));

    const bookmarkedArticleIdsSet = new Set(
      currentUser.bookmarkedArticles || [],
    );
    setBookmarkedStatus(bookmarkedArticleIdsSet.has(article._id));
  }, [article._id, currentUser.likedArticles, currentUser.bookmarkedArticles]);

  useEffect(() => {
    const editMode = new URLSearchParams(location.search).get("edit");
    setReadOnly(editMode === "true" ? false : true);
  }, [location.search]);

  useEffect(() => {
    const fetchArticle = async () => {
      const articleId = slug.split("-").pop();

      try {
        const res = await axios.get(
          mode === "DEV"
            ? `/api/articles/${articleId}`
            : `https://tech-tales-api.vercel.app/api/articles/${articleId}`,
        );

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
  }, [slug, currentUser]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLinkCopied(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [linkCopied]);

  function handleToggleTags() {
    setShowAllTags(!showAllTags);
  }

  async function handleLike() {
    const likeCount = article.likes + (likedStatus ? -1 : 1);

    const currentTime = new Date().getTime();
    if (currentTime - lastLikeClickTime < 1000) {
      return;
    }
    setLastLikeClickTime(currentTime);

    try {
      dispatch(updateUserStart());

      setLikedStatus(!likedStatus);

      const updatedLikedArticles = likedStatus
        ? currentUser.likedArticles.filter((id) => id !== article._id)
        : [...currentUser.likedArticles, article._id];

      const res = await axios.patch(
        mode === "DEV"
          ? `/api/user/${currentUser._id}`
          : `https://tech-tales-api.vercel.app/api/user/${currentUser._id}`,
        {
          ...currentUser,
          likedArticles: updatedLikedArticles,
        },
      );
      const data = res.data;

      await axios.patch(
        mode === "DEV"
          ? `/api/articles/${article._id}`
          : `https://tech-tales-api.vercel.app/api/articles/${article._id}`,
        { likes: likeCount },
      );

      dispatch(updateUserSuccess(data));
    } catch (error) {
      error.message = error.response
        ? error.response.data.message
        : error.response.statusText;
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleBookmark() {
    const currentTime = new Date().getTime();
    if (currentTime - lastBookmarkClickTime < 1000) {
      return;
    }
    setLastBookmarkClickTime(currentTime);

    try {
      dispatch(updateUserStart());

      setBookmarkedStatus(!bookmarkedStatus);

      const updatedBookmarkedArticles = bookmarkedStatus
        ? currentUser.bookmarkedArticles.filter((id) => id !== article._id)
        : [...currentUser.bookmarkedArticles, article._id];

      const res = await axios.patch(
        mode === "DEV"
          ? `/api/user/${currentUser._id}`
          : `https://tech-tales-api.vercel.app/api/user/${currentUser._id}`,
        {
          ...currentUser,
          bookmarkedArticles: updatedBookmarkedArticles,
        },
      );
      const data = res.data;

      dispatch(updateUserSuccess(data));
    } catch (error) {
      console.log(error.message);
      error.message = error.response
        ? error.response.data.message
        : error.response.statusText;
      dispatch(updateUserFailure(error.message));
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(
        location.origin +
          "/article/" +
          article.title.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "") +
          "-" +
          article._id,
      );
      setLinkCopied(true);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="article flex flex-col mt-16 max-w-3xl mx-auto p-2 gap-4">
      <p className="mt-6 font-serif font-bold text-4xl text-slate-900 break-words">
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

        <p className="font-light mt-1 mx-1">•</p>

        <p className="text-slate-700 text-sm font-normal mt-1">
          {" " + readTime + " "}
          {readTime > 1 ? "minutes read" : "minute read"}
        </p>

        {publishDate && <p className="font-light mt-1 mx-1">•</p>}

        <p className="text-slate-700 text-sm font-normal mt-1">{publishDate}</p>
      </div>

      <div className="flex flex-wrap items-center w-full gap-4 overflow-x-auto select-none">
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

      <hr />

      <div className="flex justify-between items-center gap-x-4 select-none">
        <div className="flex items-center gap-1">
          <img
            src={likedStatus ? "/liked.png" : "/like.png"}
            alt="like"
            className="h-5 w-5 hover:scale-125 cursor-pointer"
            onClick={handleLike}
          />
          <p className="font-medium">{article.likes}</p>

          <img
            src="/comment.png"
            alt="comment"
            className="h-6 w-6 hover:scale-125 ml-5 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-x-6">
          <img
            src={bookmarkedStatus ? "/bookmarked.png" : "/bookmark.png"}
            alt="bookmark"
            className="h-5 w-5 hover:scale-125 cursor-pointer"
            onClick={handleBookmark}
          />
          <img
            src={"/link.png"}
            alt="copy-link"
            className="h-7 w-7 hover:scale-125 cursor-pointer"
            onClick={handleCopyLink}
          />
        </div>
      </div>

      <hr />

      {linkCopied && (
        <div className="fixed top-18 right-2 flex items-center justify-center w-52 bg-indigo-500 opacity-60 rounded">
          <span className="text-white font-semibold">
            Link copied to clipboard!
          </span>
        </div>
      )}

      <div className="flex justify-center items-center font-serif text-justify text-xl">
        <ReactQuill
          theme="bubble"
          modules={{
            toolbar: false,
          }}
          value={article.content}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

export default Article;
