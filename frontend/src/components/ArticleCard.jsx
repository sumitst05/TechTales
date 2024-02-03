function ArticleCard({ article, likedStatus, handleLike }) {
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
            src={likedStatus[article._id] ? "/liked.png" : "/like.png"}
            alt="like"
            className="rounded-full w-5 h-5 sm:w-8 sm:h-8"
            onClick={() => handleLike(article._id)}
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
