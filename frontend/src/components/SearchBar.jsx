import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function SearchBar() {
	const mode = import.meta.env.VITE_MODE;

	const [search, setSearch] = useState("");
	const [suggestions, setSuggestions] = useState({ people: [], articles: [] });
	const [toggleSuggestions, setToggleSuggestions] = useState(false);
	const [highlightIndex, setHighlightIndex] = useState(-1);

	const suggestionRef = useRef(null);
	const navigate = useNavigate();

	function handleEnter() {
		if (highlightIndex !== -1) {
			const totalPeople = suggestions.people.length;
			if (highlightIndex < totalPeople) {
				const user = suggestions.people[highlightIndex];
				navigate(`/user/${user.username}-${user._id}`);
			} else {
				const article = suggestions.articles[highlightIndex - totalPeople];
				navigate(
					`/article/${article.title
						.toLowerCase()
						.replace(/[^a-zA-Z0-9-]/g, "")}-${article._id}`,
				);
			}
			setToggleSuggestions(false);
			setHighlightIndex(-1);
		}
	}

	function handleKeyDown(e) {
		if (e.key === "Escape") {
			setToggleSuggestions(false);
			setHighlightIndex(-1);
		} else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
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
		} else if (e.key === "Enter") {
			e.preventDefault();
			handleEnter();
		}
	}

	useEffect(() => {
		setHighlightIndex(0);

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

		window.addEventListener("click", closeSuggestions);

		return () => {
			window.removeEventListener("click", closeSuggestions);
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
		<div className="flex flex-grow items-center relative z-10">
			<input
				type="text"
				id="search_article"
				placeholder="Search"
				className="text-center bg-slate-100 p-1 rounded-lg outline-none outline-violet-700 outline-2 w-full"
				onChange={handleChange}
				onKeyDown={handleKeyDown}
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
							<Link
								to={`/user/${person.username}-${person._id}`}
								key={person._id}
							>
								<div
									className={`flex mt-2 justify-center items-center hover:bg-slate-200 ${highlightIndex === index ? "bg-slate-200" : ""
										}`}
								>
									<img
										src={person.profilePicture}
										alt="profile-pic"
										className="rounded-full mr-4 w-8 h-8"
									/>
									<p className="font-medium text-slate-500">
										{person.username}
									</p>
								</div>
							</Link>
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
							<Link
								to={`/article/${article.title.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${article._id}`}
								key={article._id}
							>
								<div
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
							</Link>
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
