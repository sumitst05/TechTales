import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

import { updateUserSuccess } from "../redux/user/userSlice";

function LikedArticles() {
	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(
		parseInt(localStorage.getItem("likedArticlesPage")) || 1,
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
				if (!articleUpdate) {
					setLoading(true);
				}
				const res = await axios.get(
					`/api/user/liked/?page=${page}&pageSize=${pageSize}`,
					{ withCredentials: true },
				);

				const likedArticles = res.data.likedArticles;

				setArticles([...likedArticles].reverse());
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
	}, [page, pageSize]);

	useEffect(() => {
		localStorage.setItem("likedArticlesPage", page.toString());
	}, [page]);

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

	return (
		<div className="flex flex-col justify-between mt-16 max-w-6xl mx-auto p-3 gap-4 select-none overflow-hidden">
			<h1 className="text-4xl text-center font-semibold p-3 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
				Liked Articles
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

export default LikedArticles;
