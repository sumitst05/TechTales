import axios from "axios";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";

function Dropdown({ dropdownRef }) {
  const dispatch = useDispatch();

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

  return (
    <div ref={dropdownRef}>
      <div className="absolute z-10 right-1 w-full mt-7 origin-top-right bg-gray-50 rounded-lg shadow-2xl md:w-64">
        <ul className="flex flex-col gap-4 text-lg mb-2">
          <Link to="/profile">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Profile
            </li>
          </Link>
          <Link to="/profile">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Notifications
            </li>
          </Link>
          <hr />
          <Link to="/profile">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Your Articles
            </li>
          </Link>
          <Link to="/profile">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Liked Articles
            </li>
          </Link>
          <Link to="/profile">
            <li className="font-medium text-blue-600 hover:bg-slate-200">
              Bookmarks
            </li>
          </Link>
          <hr />
          <button onClick={handleSignout}>
            <li className="font-medium text-red-400 hover:bg-slate-200">
              Sign out
            </li>
          </button>
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
