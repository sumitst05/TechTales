import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Pusher from "pusher-js";

import { deleteUserFailure } from "../redux/user/userSlice";
import {
	deleteArticleStart,
	deleteArticleSuccess,
} from "../redux/article/articleSlice";

const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
	cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
});

function ArticleCard({ article, onLike, onBookmark }) {
	const mode = import.meta.env.VITE_MODE;
	const [likedStatus, setLikedStatus] = useState(false);
	const [bookmarkedStatus, setBookmarkedStatus] = useState(false);
	const [linkCopied, setLinkCopied] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const { currentUser } = useSelector((state) => state.user);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const publishDate = new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(article.createdAt));

	useEffect(() => {
		const channel = pusher.subscribe("likes");

		channel.bind("articleLiked", () => { });
	}, []);

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

	async function handleCopyLink(e) {
		e.preventDefault();
		e.stopPropagation();

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

	function handleEdit(e) {
		e.preventDefault();
		e.stopPropagation();

		navigate(
			`/edit/${article.title.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${article._id}`,
		);
	}

	async function handleDelete(e) {
		e.preventDefault();
		e.stopPropagation();

		try {
			dispatch(deleteArticleStart());

			await axios.delete(
				mode === "DEV"
					? `/api/articles/${article._id}`
					: `https://tech-tales-api.vercel.app/api/articles/${article._id}`,
				{ withCredentials: true },
			);

			dispatch(deleteArticleSuccess());
		} catch (error) {
			error.message = error.response
				? error.response.data.message
				: error.response.statusText;
			dispatch(deleteUserFailure(error.message));
		} finally {
			window.location.reload();
		}
	}

	return (
		<Link
			to={`/article/${article.title.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${article._id}`}
		>
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
							src={article?.author?.profilePicture}
							alt="profile"
							className="h-6 w-6 rounded-full"
						/>
						<p className="font-medium truncate">
							{article?.author ? article?.author.username : "Unknown"}
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
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									onLike(article._id);
								}}
							/>
							<p className="font-medium">{article.likes}</p>
						</div>
						<img
							src={bookmarkedStatus ? "/bookmarked.png" : "/bookmark.png"}
							alt="bookmark"
							className="h-5 w-5 hover:scale-125"
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								onBookmark(article._id);
							}}
						/>
						<img
							src={"/link.png"}
							alt="copy-link"
							className="h-7 w-7 hover:scale-125"
							onClick={handleCopyLink}
						/>
						{(location.pathname === "/liked-articles" ||
							location.pathname === "/bookmarked-articles"
							? article?.author === currentUser._id
							: article?.author._id === currentUser._id) && (
								<>
									<img
										src="/edit.png"
										alt="edit"
										className="h-7 w-7 hover:scale-125"
										onClick={handleEdit}
									/>
									<img
										src="/delete.png"
										alt="delete"
										className="h-6 w-6 hover:scale-125"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											setShowDelete(!showDelete);
										}}
										onMouseOver={(e) =>
											(e.currentTarget.src = "/delete-hover.png")
										}
										onMouseOut={(e) => (e.currentTarget.src = "/delete.png")}
									/>
								</>
							)}
					</div>
				</div>
				<img
					src={article.coverImage}
					alt="cover-image"
					className="h-16 w-16 absolute right-4 flex-shrink-0 rounded-lg bg-slate-200"
				/>
			</div>
			{showDelete && (
				<div className="fixed top-0 left-0 z-50 bg-slate-50 bg-opacity-50 w-full h-full flex justify-center items-center cursor-auto">
					<div className="p-4 bg-gray-100 shadow-2xl fixed z-15 items-center w-full md:w-1/3 select-none">
						<p className="font-medium text-red-500">
							Are you sure you want to delete{" "}
							<span className="font-bold text-slate-600 overflow-ellipsis break-words">
								{article.title}
							</span>{" "}
							?
						</p>
						<div className="flex justify-end mt-4">
							<button
								className="bg-red-500 text-white px-4 py-2 rounded-md mr-4"
								onClick={handleDelete}
							>
								Delete
							</button>
							<button
								className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setShowDelete(false);
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</Link>
	);
}

export default ArticleCard;
