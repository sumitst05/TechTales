import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import ArticleCard from "../components/ArticleCard";

function YourArticles() {
	const [articles, setArticles] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);
	const [totalPages, setTotalPages] = useState(0);

	const { currentUser } = useSelector((state) => state.user);

	useEffect(() => {
		const fetchArticles = async () => {
			try {
				const res = await axios.get(
					`/api/articles/myarticles/?userId=${currentUser._id}&page=${page}&pageSize=${pageSize}`,
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
	}, [page, pageSize, currentUser]);

	return (
		<div className="flex flex-col justify-between mt-16 max-w-6xl mx-auto p-3 select-none overflow-hidden">
			<h1 className="text-4xl text-center font-semibold p-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
				Your Articles
			</h1>
			<div className="flex justify-center mx-auto w-full mt-2">
				<div className="relative w-full md:max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
					{articles.map((article) => (
						<ArticleCard key={article._id} article={article} />
					))}
				</div>
			</div>

			<div className="flex items-center justify-center self-center w-full gap-2 md:fixed md:bottom-2 md:z-10">
				<button
					className="disabled:scale-75 rounded-full"
					disabled={page === 1}
					onClick={() => setPage(1)}
				>
					<img
						src="/first.png"
						alt="first"
						className="w-6 h-6 hover:scale-125"
					/>
				</button>
				<button
					className="disabled:scale-75 rounded-full"
					disabled={page === 1}
					onClick={() => setPage(page - 1)}
				>
					<img src="/prev.png" alt="prev" className="w-6 h-6 hover:scale-125" />
				</button>
				<span className="font-medium text-center text-slate-700 p-2">
					{`${page} / ${totalPages}`}
				</span>
				<button
					className="disabled:scale-75 rounded-full"
					disabled={page === totalPages}
					onClick={() => setPage(page + 1)}
				>
					<img src="/next.png" alt="next" className="w-6 h-6 hover:scale-125" />
				</button>
				<button
					className="disabled:scale-75 rounded-full"
					disabled={page === totalPages}
					onClick={() => setPage(totalPages)}
				>
					<img src="/last.png" alt="prev" className="w-6 h-6 hover:scale-125" />
				</button>
			</div>
		</div>
	);
}

export default YourArticles;
