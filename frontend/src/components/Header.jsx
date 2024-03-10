import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from "../redux/user/userSlice";
import { resetCurrentArticle } from "../redux/article/articleSlice";

import logoImage from "/logo.png";
import Dropdown from "./Dropdown";

function Header() {
  const mode = import.meta.env.VITE_MODE;

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const dropdownRef = useRef(null);

  const [dropdown, setDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function toggleDropdown(e) {
    e.stopPropagation();
    setDropdown((dropdown) => !dropdown);
  }

  function showDeleteModal() {
    setShowModal(true);
  }

  async function handleDeleteAccount() {
    try {
      dispatch(deleteUserStart());

      await axios.delete(
        mode === "DEV"
          ? "/api/user/delete"
          : "https://tech-tales-api.vercel.app/api/user/delete",
        {
          withCredentials: true,
        },
      );

      dispatch(resetCurrentArticle());
      dispatch(deleteUserSuccess());
    } catch (error) {
      console.log(error.message);
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(deleteUserFailure(error.message));
    } finally {
      setShowModal(false);
    }
  }

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        setDropdown(false);
      }
    };

    window.addEventListener("click", closeDropdown);
    window.addEventListener("keydown", handleEscapeKey);
    return () => {
      window.removeEventListener("click", closeDropdown);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [dropdownRef, dropdown]);

  return (
    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 fixed top-0 left-0 w-full z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-1 py-3">
        <Link to="/">
          <div className="flex items-center">
            <img
              src={logoImage}
              alt="TechTales Logo"
              className="h-10 w-10 object-cover"
            />
            <h1 className="md:text-2xl text-gray-200 font-bold select-none">
              TechTales
            </h1>
          </div>
        </Link>
        <ul className="flex items-center gap-2 md:gap-4">
          <Link to="/write">
            <li className="md:font-semibold text-gray-300 select-none">
              Write
            </li>
          </Link>
          <Link to="/explore">
            <li className="md:font-semibold text-gray-300 select-none">
              Explore
            </li>
          </Link>
          <Link to="/learn-more">
            <li className="md:font-semibold text-gray-300 select-none">
              Learn More
            </li>
          </Link>
          {currentUser ? (
            <button onClick={toggleDropdown}>
              {" "}
              <img
                src={
                  currentUser.data
                    ? currentUser.data.profilePicture
                    : currentUser.profilePicture
                }
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />
              {dropdown && (
                <Dropdown
                  dropdownRef={dropdownRef}
                  showDeleteModal={showDeleteModal}
                />
              )}
            </button>
          ) : (
            <Link to="/sign-in">
              <li className="md:font-semibold text-gray-300">Sign In</li>
            </Link>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-slate-900 bg-opacity-50">
          <div className="flex flex-col items-center bg-white p-8 rounded-md">
            <p className="text-red-700 text-center mb-5">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={handleDeleteAccount}
              >
                Yes
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
