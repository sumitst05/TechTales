import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ArticleCarousel() {
	const mode = import.meta.env.VITE_MODE;

	const NextArrow = ({ className, style, onClick }) => (
		<img
			src="/next.png"
			className={className}
			style={style}
			onClick={onClick}
			alt="Next"
		/>
	);

	const PrevArrow = ({ className, style, onClick }) => (
		<img
			src="/prev.png"
			className={className}
			style={style}
			onClick={onClick}
			alt="Previous"
		/>
	);

	const settings = {
		dots: true,
		infinite: true,
		speed: 2000,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		lazyLoad: true,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
	};

	const [articles, setArticles] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchTopArticles = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					mode === "DEV"
						? `/api/articles?pageSize=5`
						: `https://tech-tales-api.vercel.app/api/articles?pageSize=5`,
				);

				const data = res.data.articles;
				setArticles(data);
			} catch (error) {
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchTopArticles();
	}, []);

	if (loading) {
		return (
			<div className="animate-pulse flex items-center p-4 gap-4 md:mx-16 bg-gradient-to-r from-zinc-200 to-slate-100 rounded-xl">
				<div className="h-32 w-32 bg-slate-400 rounded flex-shrink-0"></div>{" "}
				<div className="flex flex-col overflow-hidden gap-2">
					<div className="flex gap-2 items-center">
						<div className="h-6 w-6 bg-slate-400 rounded-full"></div>{" "}
						<div className="h-4 bg-slate-400 rounded w-32"></div>{" "}
					</div>
					<div className="h-4 bg-slate-400 rounded w-64"></div>{" "}
					<div className="flex gap-4">
						{[1, 2, 3].map((_, index) => (
							<div key={index} className="h-4 bg-slate-400 rounded w-32"></div>
						))}{" "}
					</div>
					<div className="flex items-center gap-1 md:gap-2">
						<div className="h-4 bg-slate-400 rounded w-32"></div>{" "}
						<div className="font-light">•</div>
						<div className="h-4 bg-slate-400 rounded w-32"></div>{" "}
					</div>
				</div>
			</div>
		);
	}

	return (
		<Slider {...settings}>
			{articles &&
				articles.map((article) => (
					<div
						key={article._id}
						className="flex flex-col items-center justify-center w-full px-0.5 md:px-16 text-slate-700"
					>
						<Link
							to={`/article/${article.title.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${article._id}`}
						>
							<div className="flex items-center p-4 gap-4 bg-gradient-to-r from-zinc-200 to-slate-100 rounded-xl">
								<img
									src={article?.coverImage}
									alt="cover-image"
									className="h-32 w-32 flex-shrink-0 rounded-lg bg-slate-200"
								/>
								<div className="flex flex-col overflow-hidden">
									<div className="flex gap-2 items-center">
										<img
											src={article?.author?.profilePicture}
											alt="profile"
											className="h-6 w-6 rounded-full"
										/>
										<p className="font-medium truncate">
											{article?.author ? article?.author.username : "Unknown"}
										</p>
									</div>
									<div className="flex items-center gap-2">
										<img src="/liked.png" alt="likes" className="h-5 w-5" />
										<p className="font-medium">{article.likes}</p>
									</div>
									<p className="text-3xl font-bold truncate mt-1">
										{article.title}
									</p>
									<div className="flex gap-4">
										{article.tags.slice(0, 5).map((tag, index) => (
											<div key={index}>
												{index < 5 && (
													<p className="px-2 bg-gradient-to-r from-slate-300 to-zinc-200 text-slate-600 text-sm font-medium rounded-lg">
														{tag}
													</p>
												)}
											</div>
										))}
									</div>
									<div className="flex items-center gap-1 md:gap-2">
										<p className="text-sm truncate">
											{Math.ceil(article.content.split(" ").length / 200) + " "}
											{Math.ceil(article.content.split(" ").length / 200) > 1
												? "minutes read"
												: "minute read"}
										</p>
										<p className="font-light">•</p>
										<p className="text-sm truncate">
											{Intl.DateTimeFormat("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											}).format(new Date(article.createdAt))}
										</p>
									</div>
								</div>
							</div>
						</Link>
					</div>
				))}
		</Slider>
	);
}

export default ArticleCarousel;
