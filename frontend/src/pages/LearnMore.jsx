import React from "react";

function LearnMore() {
	return (
		<div className="fixed top-16 left-0 w-full h-full flex items-center justify-center">
			<div className="p-8 rounded-xl flex flex-col items-center justify-between">
				<div>
					<div className="flex md:flex-row flex-col items-center justify-center gap-2">
						<img
							src="/logo.png"
							alt="TechTales Logo"
							className="h-24 w-24 rounded-full mb-6"
						/>
						<h2 className="text-4xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800 font-bold text-center mb-8">
							Welcome to TechTales
						</h2>
					</div>
					<div className="flex flex-col md:flex-row items-center justify-center gap-8">
						<div className="md:w-1/2">
							<p className="text-lg text-gray-800 leading-relaxed">
								Welcome to TechTales, your go-to destination for all things
								tech-related! Whether you're a seasoned developer, a curious
								tech enthusiast, or just someone who loves to stay updated on
								the latest trends, TechTales has something for you.
							</p>
							<p className="text-lg text-gray-800 leading-relaxed mt-4">
								Dive into a world of insightful articles, engaging discussions,
								and vibrant community interactions. Share your tech experiences,
								learn from others, and stay ahead of the curve in the
								ever-evolving landscape of technology.
							</p>
						</div>
					</div>
				</div>
				<a
					href="https://github.com/sumitst05/TechTales"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center justify-center mt-8"
				>
					<img src="/github.png" alt="GitHub Logo" className="h-10 w-10 mr-2" />
					<p className="text-gray-600">GitHub Repository</p>
				</a>
			</div>
		</div>
	);
}

export default LearnMore;
