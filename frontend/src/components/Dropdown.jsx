import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { signOut } from "../redux/user/userSlice";
import { resetCurrentArticle } from "../redux/article/articleSlice";

function Dropdown({ dropdownRef, showDeleteModal }) {
  const mode = import.meta.env.VITE_MODE;

  const dispatch = useDispatch();

  async function handleSignout() {
    try {
      localStorage.removeItem("yourArticlesPage");
      localStorage.removeItem("bookmarkPage");
      localStorage.removeItem("likedArticlesPage");
      localStorage.removeItem("explorePage");

      await axios.post(
        mode === "DEV"
          ? `/api/auth/signout`
          : `https://tech-tales-api.vercel.app/api/auth/signout`,
        { withCredentials: true },
      );

      dispatch(resetCurrentArticle());
      dispatch(signOut());
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
    }
  }

  function confirmDeleteAccount() {
    showDeleteModal();
  }

  return (
    <div ref={dropdownRef}>
      <div className="absolute z-10 top-11 right-1 w-full mt-5 bg-gray-50 rounded-lg shadow-2xl md:w-64">
        <ul className="flex flex-col gap-4 text-lg mt-2 mb-2">
          <Link to="/profile">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Profile
            </li>
          </Link>
          <Link to="/notifications">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Notifications
            </li>
          </Link>
          <hr />
          <Link to="/your-articles">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Your Articles
            </li>
          </Link>
          <Link to="/liked-articles">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Liked Articles
            </li>
          </Link>
          <Link to="/bookmarks">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Bookmarks
            </li>
          </Link>
          <hr />
          <div onClick={handleSignout}>
            <li className="font-medium text-red-400 hover:bg-red-200">
              Sign out
            </li>
          </div>
          <div onClick={confirmDeleteAccount}>
            <li className="font-medium text-red-400 hover:bg-red-200">
              Delete Account
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
