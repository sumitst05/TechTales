import SearchBar from "../components/SearchBar";
import ArticleCarousel from "../components/ArticleCarousel";
import UserCarousel from "../components/UserCarousel";

function Home() {
	return (
		<div className="flex flex-col w-full mt-16 max-w-6xl mx-auto p-3 gap-2">
			<SearchBar />

			<h1 className="text-4xl text-center font-semibold py-1 px-3 mt-8 mb-8 md:mt-2 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800 select-none">
				Top Articles
			</h1>
			<div className="px-6 md:px-32">
				<ArticleCarousel />
			</div>

			<h1 className="text-4xl text-center font-semibold py-1 px-3 mt-16 mb-8 md:mt-4 md:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800 select-none">
				Top Authors
			</h1>
			<div className="px-6 md:px-32">
				<UserCarousel />
			</div>
		</div>
	);
}

export default Home;
