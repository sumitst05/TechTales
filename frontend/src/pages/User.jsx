import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import ArticleCard from "../components/ArticleCard";
import Loader from "../components/Loader";
import {
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
	authFailure,
} from "../redux/user/userSlice";

function User() {
	const { slug } = useParams();
	const userId = slug.split("-").pop();

	const [user, setUser] = useState({});
	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [articleUpdate, setArticleUpdate] = useState(false);
	const [followersSelected, setFollowersSelected] = useState(false);
	const [followingSelected, setFollowingSelected] = useState(false);
	const [articlesSelected, setArticlesSelected] = useState(true);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [follow, setFollow] = useState(false);

	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();

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

	async function handleFollow() {
		try {
			dispatch(updateUserStart());
			const res = await axios.patch(
				`/api/user/follow/${userId}?unfollow=${follow}`,
				{
					following: currentUser.following.includes(userId)
						? currentUser.following.filter((id) => id !== userId)
						: [...currentUser.following, userId],
				},
				{ withCredentials: true },
			);

			dispatch(updateUserSuccess(res.data));
			setFollow(!follow);
		} catch (error) {
			console.log(error.message);
			dispatch(updateUserFailure(error.message));
		}
	}

	async function handleArticleLike(articleId) {
		try {
			setArticleUpdate(true);

			const res = await axios.patch(
				`/api/articles/like/${articleId}`,
				{},
				{ withCredentials: true },
			);
			const updatedLikes = res.data.article.likes;

			setArticles((prevArticles) =>
				prevArticles.map((article) =>
					article._id === articleId
						? { ...article, likes: updatedLikes }
						: article,
				),
			);

			dispatch(
				updateUserSuccess({
					...currentUser,
					likedArticles: res.data.user.likedArticles,
				}),
			);
		} catch (error) {
			console.log(error.message);
		}
	}

	async function handleArticleBookmark(articleId) {
		try {
			const res = await axios.patch(
				"/api/user/update",
				{
					...currentUser,
					bookmarkedArticles: currentUser.bookmarkedArticles.includes(articleId)
						? currentUser.bookmarkedArticles.filter((id) => id !== articleId)
						: [...currentUser.bookmarkedArticles, articleId],
				},
				{ withCredentials: true },
			);

			dispatch(updateUserSuccess(res.data));
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`/api/user/${userId}`, {
					withCredentials: true,
				});

				setUser(res.data);
				setFollow(currentUser.following.indexOf(userId) === -1 ? false : true);
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
				const res = await axios.get(`/api/articles/myarticles/${userId}`, {
					withCredentials: true,
				});

				setArticles(res.data.articles);
				setLoading(false);
			} catch (error) {
				error.message = error.response
					? error.response.data.message
					: error.message;
				dispatch(authFailure(error.message));
				setLoading(false);
			}
		};

		fetchUser();
		fetchArticles();
	}, [userId]);

	useEffect(() => {
		const fetchFollowersAndFollowing = async () => {
			try {
				const res = await axios.get(`/api/user/followers-following/${userId}`, {
					withCredentials: true,
				});

				setFollowers(res.data.followers);
				setFollowing(res.data.following);
			} catch (error) {
				console.log(error.message);
			}
		};

		fetchFollowersAndFollowing();
	}, [follow]);

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

			<div className="flex justify-center items-center gap-6">
				{user.xAccount ? (
					<a
						href={currentUser.xAccount}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src="/X.png" alt="X" className="h-8 w-8" />
					</a>
				) : (
					<div className="cursor-not-allowed">
						<img src="/no-X.png" alt="No X" className="h-8 w-8" />
					</div>
				)}

				{user.githubProfile ? (
					<a
						href={user.githubProfile}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src="/github.png" alt="GitHub" className="h-12 w-12" />
					</a>
				) : (
					<div className="cursor-not-allowed">
						<img src="/no-github.png" alt="No GitHub" className="h-12 w-12" />
					</div>
				)}

				<button
					onClick={handleFollow}
					disabled={currentUser._id === userId}
					className="disabled:opacity-60"
				>
					<img
						src={follow ? `/following.png` : `/follow.png`}
						alt="Follow"
						className={`h-8 w-8 ${currentUser._id === userId ? "cursor-not-allowed" : ""}`}
					/>
				</button>
			</div>

			<ul className="flex justify-center items-center gap-4 lg:gap-6 select-none mt-6">
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
							? "text-xl text-indigo-600 font-bold bg-zinc-300 p-2 px-3 rounded-lg hover:shadow-md hover:shadow-indigo-600"
							: "text-lg text-violet-800 font-bold bg-zinc-300 p-2 px-3 rounded-md shadow shadow-indigo-800 hover:scale-125 hover:shadow-md hover:shadow-indigo-600"
					}
					onClick={() => handleSelect("articles")}
				>
					Articles
				</li>
			</ul>

			{followersSelected ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
					{followers &&
						followers.map((user) => (
							<a
								href={`/user/${user.username.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${user._id}`}
								target="_blank"
								key={user._id}
							>
								<div className="flex items-center p-4 gap-4 bg-gradient-to-r from-zinc-200 to-slate-100 rounded-xl">
									<img
										src={
											user.data ? user.data.profilePicture : user.profilePicture
										}
										alt="cover-image"
										className="h-16 w-16 object-cover flex-shrink-0 rounded-full bg-slate-200"
									/>
									<div className="flex flex-col overflow-hidden">
										<p className="text-3xl font-bold truncate">
											{user.data ? user.data.username : user.username}
										</p>
										<div className="flex items-center">
											<p className="text-sm truncate">
												Joined:{" "}
												{Intl.DateTimeFormat("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												}).format(new Date(user.createdAt))}
											</p>
											<p className="font-light mx-2">•</p>
											<p className="text-sm truncate">
												{user.followerCount +
													(user.followerCount == 1
														? " Follower"
														: " Followers")}
											</p>
										</div>
										<p className="text-lg break-words line-clamp-1 mt-2">
											{user?.bio}
										</p>
									</div>
								</div>
							</a>
						))}
				</div>
			) : followingSelected ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
					{following &&
						following.map((user) => (
							<a
								href={`/user/${user.username.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${user._id}`}
								target="_blank"
								key={user._id}
							>
								<div className="flex items-center p-4 gap-4 bg-gradient-to-r from-zinc-200 to-slate-100 rounded-xl">
									<img
										src={
											user.data ? user.data.profilePicture : user.profilePicture
										}
										alt="cover-image"
										className="h-16 w-16 object-cover flex-shrink-0 rounded-full bg-slate-200"
									/>
									<div className="flex flex-col overflow-hidden">
										<p className="text-3xl font-bold truncate">
											{user.data ? user.data.username : user.username}
										</p>
										<div className="flex items-center">
											<p className="text-sm truncate">
												Joined:{" "}
												{Intl.DateTimeFormat("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												}).format(new Date(user.createdAt))}
											</p>
											<p className="font-light mx-2">•</p>
											<p className="text-sm truncate">
												{user.followerCount +
													(user.followerCount == 1
														? " Follower"
														: " Followers")}
											</p>
										</div>
										<p className="text-lg break-words line-clamp-1 mt-2">
											{user?.bio}
										</p>
									</div>
								</div>
							</a>
						))}
				</div>
			) : articlesSelected ? (
				<div className="flex-grow w-full md:max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
					{loading && <Loader />}
					{!loading &&
						articles.map((article) => (
							<ArticleCard
								key={article._id}
								article={article}
								onLike={handleArticleLike}
								onBookmark={handleArticleBookmark}
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
