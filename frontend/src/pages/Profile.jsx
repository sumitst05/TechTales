import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

import { app } from "../firebase";
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";

function Profile() {
  const mode = import.meta.env.VITE_MODE;

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({});
  const [image, setImage] = useState(undefined);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [inValidUrl, setInvalidUrl] = useState(false);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

  useEffect(() => {
    dispatch(updateUserFailure(null));

    return () => {
      dispatch(updateUserFailure(null));
    };
  }, []);

  async function handleImageUpload(image) {
    const storage = getStorage(app);
    const imageName = new Date().getTime() + image.name;
    const storageRef = ref(storage, imageName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, profilePicture: downloadURL });
        });
      },
    );
  }

  function isValidURL(string) {
    if (!string) {
      return true;
    }

    try {
      const url = new URL(string);
      if (url.protocol !== "https:") {
        return false;
      }

      return true;
    } catch (_) {
      return false;
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    console.log(formData);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!isValidURL(formData.xAccount) || !isValidURL(formData.githubProfile)) {
      setInvalidUrl(true);
      return;
    } else {
      setInvalidUrl(false);
    }

    try {
      dispatch(updateUserStart());

      const res = await axios.patch(
        mode === "DEV"
          ? `/api/user/${currentUser._id}`
          : `https://tech-tales-api.vercel.app/api/user/${currentUser._id}`,
        formData,
        {
          withCredentials: true,
        },
      );
      const data = res.data;

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto mt-16">
      <h1 className="text-4xl text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
        Profile
      </h1>
      <form className="flex flex-col gap-4 mt-2 w-full" onSubmit={handleSubmit}>
        <div className="flex justify-between gap-4 mt-2 w-full">
          <input
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <img
            src={formData.profilePicture || currentUser.profilePicture}
            alt="profile"
            onClick={() => fileRef.current.click()}
            className="h-24 w-24 self-center cursor-pointer rounded-full"
          />

          <textarea
            id="bio"
            name="Bio"
            maxLength="300"
            defaultValue={currentUser.bio}
            placeholder="Write a short bio..."
            className="w-full bg-slate-200 p-2 rounded-lg outline-none focus:outline-violet-700 resize-none"
            onChange={handleChange}
          />
        </div>

        <span className="text-sm font-medium text-sky-800 opacity-60 self-center -m-2">
          Image size must be under 2MB
        </span>

        <p className="text-sm font-medium self-center">
          {imageError ? (
            <span className="text-sm font-medium text-red-700">
              Error while uploading image!
            </span>
          ) : imageUploadProgress > 0 && imageUploadProgress < 100 ? (
            <span className="text-sm font-medium text-slate-700">{`Uploading: ${imageUploadProgress}%`}</span>
          ) : imageUploadProgress === 100 ? (
            <span className="text-green-700">Image uploaded successfully!</span>
          ) : (
            ""
          )}
        </p>

        <input
          defaultValue={
            currentUser.data ? currentUser.data.username : currentUser.username
          }
          type="text"
          id="username"
          placeholder="Username"
          onChange={handleChange}
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
        />
        <input
          defaultValue={
            currentUser.data ? currentUser.data.email : currentUser.email
          }
          type="text"
          id="email"
          placeholder="Email"
          onChange={handleChange}
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
        />
        <input
          type="text"
          id="password"
          placeholder="Password"
          onChange={handleChange}
          className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
        />

        <div className="flex gap-x-4 w-full">
          <div className="flex-1">
            <input
              id="xAccount"
              name="X"
              defaultValue={currentUser?.xAccount}
              placeholder="X Account"
              className="w-full bg-slate-200 p-2 rounded-lg outline-none focus:outline-violet-700 resize-none"
              onChange={handleChange}
            />
          </div>
          <div className="flex-1">
            <input
              id="githubProfile"
              name="GitHub"
              defaultValue={currentUser?.githubProfile}
              placeholder="GitHub Profile"
              className="w-full bg-slate-200 p-2 rounded-lg outline-none focus:outline-violet-700 resize-none"
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
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
              <span>Update</span>
            </div>
          )}
        </button>
      </form>

      <p className="text-red-700 mt-2">
        {error ? error || "Something went wrong!" : ""}
      </p>

      <p className="text-red-700 mt-2">
        {inValidUrl && "Invalid url recieved!"}
      </p>

      <p className="text-green-700 mt-2">
        {updateSuccess && "Profile updated successfully!"}
      </p>
    </div>
  );
}

export default Profile;
