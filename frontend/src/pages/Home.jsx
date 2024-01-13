function Home() {
	return (
		<>
			<div className="flex justify-between items-center mt-2 max-w-6xl mx-auto p-3 gap-16">
				<input
					type="text"
					id="search_article"
					placeholder="Search"
					className="text-center bg-slate-100 p-1 rounded-lg outline-none outline-violet-700 outline-2 w-full"
				/>

				<button className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-95 disabled:opacity-80">
					Write
				</button>
			</div>
		</>
	);
}

export default Home;
