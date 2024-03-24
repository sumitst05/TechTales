import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";
import Tags from "../components/Tags";
import Pagination from "../components/Pagination";
import Loader from "../components/Loader";

import { updateUserFailure, updateUserSuccess } from "../redux/user/userSlice";

function Explore() {
	const mode = import.meta.env.VITE_MODE;

	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(
		parseInt(localStorage.getItem("explorePage")) || 1,
	);
	const [pageSize, setPageSize] = useState(10);
	const [totalPages, setTotalPages] = useState(0);
	const [selectedTag, setSelectedTag] = useState("");
	const [articleUpdate, setArticleUpdate] = useState(false);

	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();

	function handleTagSelection(tag) {
		setSelectedTag(tag);
		setPage(1);
	}

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				if (!articleUpdate) {
					setLoading(true);
				} else {
					setLoading(false);
				}
				const res = await axios.get(
					mode === "DEV"
						? `/api/articles/?query=${selectedTag}&page=${page}&pageSize=${pageSize}`
						: `https://tech-tales-api.vercel.app/api/articles/?query=${selectedTag}&page=${page}&pageSize=${pageSize}`,
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
			}
		};

		fetchArticles();
	}, [page, pageSize, selectedTag]);

	useEffect(() => {
		localStorage.setItem("explorePage", page.toString());
	}, [page]);

	async function handleLike(articleId) {
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
			dispatch(updateUserFailure(error.message));
			console.log(error.message);
		}
	}

	async function handleBookmark(articleId) {
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
		<div className="flex flex-col mt-16 max-w-6xl mx-auto p-3 gap-6 select-none overflow-hidden">
			<Tags handleTagSelection={handleTagSelection} />

			<div className="flex-grow w-full md:max-w-screen-2xl grid grid-cols-1 lg:grid-cols-2 gap-4">
				{loading && <Loader />}
				{!loading &&
					articles.map((article) => (
						<ArticleCard
							key={article._id}
							article={article}
							onLike={handleLike}
							onBookmark={handleBookmark}
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

export default Explore;
