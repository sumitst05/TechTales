import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
	const [search, setSearch] = useState("");
	const [toggleSuggestions, setToggleSuggestions] = useState(false);
	const suggestionRef = useRef(null);

	useEffect(() => {
		const closeSuggestions = (e) => {
			if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
				setToggleSuggestions(false);
			}
		};
		const handleEscapeKey = (e) => {
			if (e.key === "Escape") {
				setToggleSuggestions(false);
			}
		};
		window.addEventListener("click", closeSuggestions);
		window.addEventListener("keydown", handleEscapeKey);
		return () => {
			window.removeEventListener("click", closeSuggestions);
			window.removeEventListener("keydown", handleEscapeKey);
		};
	}, [toggleSuggestions]);

	function handleChange(e) {
		setSearch(e.target.value);
		setToggleSuggestions(true);
	}

	return (
		<div className="flex flex-col w-full mt-16 max-w-6xl mx-auto p-3">
			<div className="flex items-center gap-16">
				<div className="flex flex-grow items-center relative">
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
							className="bg-slate-100 absolute top-full left-0 w-full mt-2 p-2 rounded-lg shadow-lg"
							ref={suggestionRef}
						>
							<p className="text-slate-500 text-center text-lg">People</p>
							<hr className="border-gray-300" />

							<ul className="flex justify-center mt-2">
								<li className="flex flex-row">
									<img alt="profile-pic" src="" className="rounded-lg" />
								</li>
							</ul>

							<p className="text-slate-500 text-center text-lg">Articles</p>
							<hr className="border-gray-300" />
						</div>
					)}
				</div>

				<Link to="/write">
					<button className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-95 disabled:opacity-80">
						Write
					</button>
				</Link>
			</div>
		</div>
	);
}

export default Home;
