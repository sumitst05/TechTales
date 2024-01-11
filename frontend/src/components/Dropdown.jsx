import { Link } from "react-router-dom";

function Dropdown({ dropdownRef }) {
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
          <Link to="/profile">
            <li className="font-medium text-red-400 hover:bg-slate-200">
              Sign out
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
