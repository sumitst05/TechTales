import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";

function Dropdown({ dropdownRef }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  async function handleSignout() {
    try {
      await axios.post(`/api/auth/signout`);
      dispatch(signOut());
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      console.log(error.message);
    }
  }

  async function handleDeleteAccount() {
    try {
      dispatch(deleteUserStart());

      await axios.delete(`/api/user/${currentUser._id}`, {
        withCredentials: true,
      });

      dispatch(deleteUserSuccess());
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div ref={dropdownRef}>
      <div className="absolute z-10 right-1 w-full mt-7 origin-top-right bg-gray-50 rounded-lg shadow-2xl md:w-64">
        <ul className="flex flex-col gap-4 text-lg mb-2">
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
          <Link to="/articles">
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
          <div onClick={handleDeleteAccount}>
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