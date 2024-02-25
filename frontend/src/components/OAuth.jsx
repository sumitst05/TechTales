import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { signInSuccess } from "../redux/user/userSlice.js";
import { useState } from "react";

function OAuth() {
  const mode = import.meta.env.VITE_MODE;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleGoogleClick() {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const requestBody = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      const response = await axios.post(
        mode === "DEV"
          ? "/api/auth/google"
          : "https://tech-tales-api.vercel.app/api/auth/google",
        requestBody,
        { withCredentials: true },
      );
      const data = response.data;

      dispatch(signInSuccess(data));

      navigate("/explore");
    } catch (error) {
      console.log("Failed to login with Google.", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-indigo-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-4">
          <img
            alt="loader"
            src="/loader_small.png"
            className="animate-spin w-4 h-4"
          />
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span>Continue with Google</span>
        </div>
      )}
    </button>
  );
}

export default OAuth;
