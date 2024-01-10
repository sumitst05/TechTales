import { GoogleAuthProvider, signInWithPopup, getAuth } from "@firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { signInSuccess } from "../redux/user/userSlice.js";

function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleGoogleClick() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const requestBody = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      const response = await axios.post("/api/auth/google", requestBody);
      const data = response.data;

      dispatch(signInSuccess(data));

      navigate("/explore");
    } catch (error) {
      console.log("Failed to login with Google.", error);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-indigo-500 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-95"
    >
      Continue with Google
    </button>
  );
}

export default OAuth;
