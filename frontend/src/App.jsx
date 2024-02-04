import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "./redux/user/userSlice";
import { resetCurrentArticle } from "./redux/article/articleSlice";

import Home from "./pages/Home";
import LearnMore from "./pages/LearnMore";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Notifications from "./pages/Notifications";
import YourArticles from "./pages/YourArticles";
import Article from "./pages/Article";
import LikedArticles from "./pages/LikedArticles";
import Bookmarks from "./pages/Bookmarks";
import WriteArticle from "./pages/WriteArticle";

import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";

import axios from "axios";

export default function App() {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.user.error);

  async function handleSignOut() {
    try {
      await axios.post("/api/auth/signout");
      dispatch(resetCurrentArticle());
      dispatch(signOut());
    } catch (error) {
      error.message = error.response
        ? error.response.message
        : error.response.statusText;
      console.log(error.message);
    }
  }

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
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/article/:articleId" element={<Article />} />
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
        </Routes>
      </BrowserRouter>
      {authError && location.pathname !== "/sign-in" && (
        <div className="fixed inset-0 flex justify-center items-center bg-slate-900 bg-opacity-50">
          <div className="flex flex-col items-center bg-white p-8 rounded-md">
            <p className="text-red-700 mb-5">
              {authError || "Something went wrong!"}
            </p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={handleSignOut}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
