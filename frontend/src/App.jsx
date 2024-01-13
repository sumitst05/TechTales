import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LearnMore from "./pages/LearnMore";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Notifications from "./pages/Notifications";
import Articles from "./pages/Articles";
import LikedArticles from "./pages/LikedArticles";
import Bookmarks from "./pages/Bookmarks";
import WriteArticle from "./pages/WriteArticle";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/explore" element={<Explore />} />
					<Route path="/learn-more" element={<LearnMore />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route element={<PrivateRoute />}>
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/notifications" element={<Notifications />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/articles" element={<Articles />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/liked-articles" element={<LikedArticles />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/bookmarks" element={<Bookmarks />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/write" element={<WriteArticle />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
