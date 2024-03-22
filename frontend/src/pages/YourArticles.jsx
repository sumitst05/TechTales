import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

import { updateUserSuccess } from "../redux/user/userSlice";

function YourArticles() {
	const mode = import.meta.env.VITE_MODE;

	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(
		parseInt(localStorage.getItem("yourArticlesPage")) || 1,
	);
	const [pageSize, setPageSize] = useState(12);
	const [totalPages, setTotalPages] = useState(0);
	const [loading, setLoading] = useState(false);
	const [articleUpdate, setArticleUpdate] = useState(false);

	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				if (articleUpdate) {
					setLoading(false);
				} else {
					setLoading(true);
				}
				const res = await axios.get(
					mode === "DEV"
						? `/api/articles/myarticles/${currentUser._id}?page=${page}&pageSize=${pageSize}`
						: `https://tech-tales-api.vercel.app/api/articles/myarticles/?page=${page}&pageSize=${pageSize}`,
					{ withCredentials: true },
				);
				setArticles(res.data.articles);
				setTotalPages(Math.ceil(res.data.totalArticles / pageSize));
				setLoading(false);
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
	}, [page, pageSize]);

	useEffect(() => {
		localStorage.setItem("yourArticlesPage", page.toString());
	}, [page]);

	async function handleArticleLike(articleId) {
		try {
			setArticleUpdate(true);

			const res = await axios.patch(
				mode === "DEV"
					? `/api/articles/like/${articleId}`
					: `https://tech-tales-api.vercel.app/api/articles/like/${articleId}`,
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
				mode === "DEV"
					? "/api/user/update"
					: "https://tech-tales-api.vercel.app/api/user/update",
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

	return (
		<div className="flex flex-col justify-between mt-16 max-w-6xl mx-auto p-3 gap-4 select-none overflow-hidden">
			<h1 className="text-4xl text-center font-semibold p-3 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
				Your Articles
			</h1>

			<div className="flex-grow w-full md:max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-4">
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
