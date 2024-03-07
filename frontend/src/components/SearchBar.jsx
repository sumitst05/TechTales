import { useState, useEffect, useRef } from "react";
import axios from "axios";

function SearchBar() {
	const mode = import.meta.env.VITE_MODE;

	const [search, setSearch] = useState("");
	const [suggestions, setSuggestions] = useState({ people: [], articles: [] });
	const [toggleSuggestions, setToggleSuggestions] = useState(false);
	const [highlightIndex, setHighlightIndex] = useState(-1);
	const suggestionRef = useRef(null);

	useEffect(() => {
		const closeSuggestions = (e) => {
			if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
				setToggleSuggestions(false);
			}
		};

		const fetchSuggestions = async () => {
			try {
				const people = await axios.get(
					mode === "DEV"
						? `/api/user/?query=${search}`
						: `https://tech-tales-api.vercel.app/api/user/?query=${search}`,
				);
				const articles = await axios.get(
					mode === "DEV"
						? `/api/articles?query=${search}&pageSize=3`
						: `https://tech-tales-api.vercel.app/api/articles?query=${search}&pageSize=3`,
				);

				setSuggestions({
					people: people.data,
					articles: articles.data.articles,
				});
			} catch (error) {
				console.log(error.message);
			}
		};

		const timer = setTimeout(() => {
			if (search.trim() !== "") {
				fetchSuggestions();
			} else {
				setSuggestions({ people: [], articles: [] });
			}
		}, 350);

		const handleEscapeKey = (e) => {
			if (e.key === "Escape") {
				setToggleSuggestions(false);
				setHighlightIndex(-1);
			}
		};

		const handleArrowKeys = (e) => {
			if (e.key === "ArrowUp" || e.key === "ArrowDown") {
				e.preventDefault();
				setHighlightIndex((prevIndex) => {
					const totalSuggestions =
						suggestions.people.length + suggestions.articles.length;
					if (e.key === "ArrowUp") {
						return prevIndex > 0 ? prevIndex - 1 : totalSuggestions - 1;
					} else {
						return (prevIndex + 1) % totalSuggestions;
					}
				});
			}
		};

		window.addEventListener("click", closeSuggestions);
		window.addEventListener("keydown", handleEscapeKey);
		window.addEventListener("keydown", handleArrowKeys);

		return () => {
			window.removeEventListener("click", closeSuggestions);
			window.removeEventListener("keydown", handleEscapeKey);
			window.removeEventListener("keydown", handleArrowKeys);
			clearTimeout(timer);
		};
	}, [
		toggleSuggestions,
		search,
		suggestions.people.length,
		suggestions.articles.length,
	]);

	function handleChange(e) {
		setSearch(e.target.value);
		setToggleSuggestions(true);
	}

	return (
		<div className="flex flex-grow items-center relative z-50">
			<input
				type="text"
				id="search_article"
				placeholder="Search"
				className="text-center bg-slate-100 p-1 rounded-lg outline-none outline-violet-700 outline-2 w-full"
				onChange={handleChange}
				onKeyDown={handleChange}
				value={search}
			/>

			{toggleSuggestions && (
				<div
					className="absolute bg-slate-100 top-full left-0 w-full mt-2 p-2 rounded-lg shadow-lg overflow-auto"
					ref={suggestionRef}
					hidden={
						suggestions.articles.length === 0 && suggestions.people.length === 0
					}
				>
					<p className="text-slate-500 text-center text-lg">People</p>
					<hr className="border-gray-300" />
					{suggestions.people.length ? (
						suggestions.people.map((person, index) => (
							<div
								key={person._id}
								className={`flex mt-2 justify-center items-center hover:bg-slate-200 ${highlightIndex === index ? "bg-slate-200" : ""
									}`}
							>
								<img
									src={person.profilePicture}
									alt="profile-pic"
									className="rounded-full mr-4 w-8 h-8"
								/>
								<p className="font-medium text-slate-500">{person.username}</p>
							</div>
						))
					) : (
						<p className="flex mt-2 justify-center text-slate-400">
							No users found
						</p>
					)}

					<p className="text-slate-500 mt-2 text-center text-lg">Articles</p>
					<hr className="border-gray-300" />
					{suggestions.articles.length ? (
						suggestions.articles.map((article, index) => (
							<div
								key={article._id}
								className={`flex mt-2 justify-center items-center hover:bg-slate-200 ${highlightIndex === suggestions.people.length + index
										? "bg-slate-200"
										: ""
									}`}
							>
								<img
									src={article.coverImage}
									alt="cover-img"
									className="rounded-lg mr-4 w-8 h-8"
								/>
								<p className="font-medium text-slate-500">{article.title}</p>
							</div>
						))
					) : (
						<p className="flex mt-2 justify-center text-slate-400">
							No articles found
						</p>
					)}
				</div>
			)}
		</div>
	);
}

export default SearchBar;
