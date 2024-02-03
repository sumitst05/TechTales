import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});
  const [checked, setChecked] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(signInFailure(""));
  }, [dispatch]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  function checkboxToggle() {
    setChecked(!checked);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await axios.post(
        "/api/auth/signin",
        { ...formData, remember: checked },
        {
          withCredentials: true,
        },
      );
      const data = res.data;

      dispatch(signInSuccess(data));

      navigate("/");
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto mt-16">
      <h1 className="text-4xl text-center font-semibold p-4 my-7 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p className="text-slate-700">Don't have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>

      <div className="flex">
        <input id="check" type="checkbox" onChange={checkboxToggle} />
        <p className="text-slate-700 p-2">Remember me</p>
      </div>

      <div>
        <p className="text-red-700 mt-5">
          {error ? error || "Something went wrong!" : ""}
        </p>
      </div>
    </div>
  );
}

export default SignIn;
