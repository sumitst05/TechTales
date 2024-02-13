import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";
import Tags from "../components/Tags";
import Pagination from "../components/Pagination";

function Explore() {
	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(
		parseInt(localStorage.getItem("yourArticlesPage")) || 1,
	);
	const [pageSize, setPageSize] = useState(6);
	const [totalPages, setTotalPages] = useState(0);
	const [selectedTag, setSelectedTag] = useState("");

	const { currentUser } = useSelector((state) => state.user);

	function handleTagSelection(tag) {
		setSelectedTag(tag);
		setPage(1);
	}

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const res = await axios.get(
					`/api/articles/?query=${selectedTag}&page=${page}&pageSize=${pageSize}`,
				);
				setArticles(res.data.articles);
				setTotalPages(Math.ceil(res.data.totalArticles / pageSize));
			} catch (error) {
				error.message = error.response
					? error.response.data.message
					: error.response.statusText;
				console.log(error.message);
			}
		};

		fetchArticles();
	}, [page, pageSize, currentUser, selectedTag]);

	useEffect(() => {
		localStorage.setItem("yourArticlesPage", page.toString());
	}, [page]);

	return (
		<div className="flex flex-col justify-between mt-16 max-w-6xl mx-auto p-3 gap-6 select-none overflow-hidden">
			<Tags handleTagSelection={handleTagSelection} />

			<div className="flex justify-center mx-auto w-full">
				<div className="relative w-full md:max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
					{articles.map((article) => (
						<ArticleCard key={article._id} article={article} />
					))}
				</div>
			</div>

			<Pagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={(newPage) => setPage(newPage)}
			/>
		</div>
	);
}

export default Explore;
