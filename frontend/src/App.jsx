import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import LearnMore from "./pages/LearnMore";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import YourArticles from "./pages/YourArticles";
import Article from "./pages/Article";
import User from "./pages/User";
import LikedArticles from "./pages/LikedArticles";
import Bookmarks from "./pages/Bookmarks";
import WriteArticle from "./pages/WriteArticle";
import EditArticle from "./pages/EditArticle";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
	return (
		<div>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route element={<PrivateRoute />}>
						<Route path="/explore" element={<Explore />} />
					</Route>
					<Route path="/learn-more" element={<LearnMore />} />
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />

					<Route element={<PrivateRoute />}>
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/user/:slug" element={<User />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/article/:slug" element={<Article />} />
					</Route>
					<Route element={<PrivateRoute />}>
						<Route path="/your-articles" element={<YourArticles />} />
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
					<Route element={<PrivateRoute />}>
						<Route path="/edit/:slug" element={<EditArticle />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}
