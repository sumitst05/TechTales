import { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function UserCarousel() {
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

	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchTopUsers = async () => {
			setLoading(true);
			try {
				const res = await axios.get(
					mode === "DEV"
						? `/api/user`
						: `https://tech-tales-api.vercel.app/api/user`,
				);

				const data = res.data;
				setUsers(data);
			} catch (error) {
				console.log(error.message);
			} finally {
				setLoading(false);
			}
		};

		fetchTopUsers();
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
			{users &&
				users.map((user) => (
					<div
						key={user._id}
						className="flex flex-col items-center justify-center w-full px-0.5 md:px-16 text-slate-700"
					>
						<Link
							to={`/user/${user.username.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")}-${user._id}`}
						>
							<div className="flex items-center p-4 gap-4 bg-gradient-to-r from-zinc-200 to-slate-100 rounded-xl">
								<img
									src={
										user.data ? user.data.profilePicture : user.profilePicture
									}
									alt="cover-image"
									className="h-32 w-32 object-cover flex-shrink-0 rounded-full bg-slate-200"
								/>
								<div className="flex flex-col overflow-hidden">
									<p className="text-3xl font-bold truncate mt-1">
										{user.data ? user.data.username : user.username}
									</p>
									<p className="text-sm truncate">
										Joined:{" "}
										{Intl.DateTimeFormat("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										}).format(new Date(user.createdAt))}
									</p>
									<p className="text-lg break-words line-clamp-2 mt-2">
										{user?.bio}
									</p>
								</div>
							</div>
						</Link>
					</div>
				))}
		</Slider>
	);
}

export default UserCarousel;
