import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { app } from "../firebase";
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage";
import {
  createArticleStart,
  createArticleSuccess,
  createArticleFailure,
  resetCurrentArticle,
} from "../redux/article/articleSlice";

function PublishArticle({ setShowPublish }) {
  const { currentArticle, loading } = useSelector((state) => state.article);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultCover =
    "https://cdn.pixabay.com/photo/2015/04/20/22/43/pen-732372_960_720.png";
  const [formData, setFormData] = useState({
    tags: [],
    coverImage: defaultCover,
  });
  const [tagInput, setTagInput] = useState("");
  const [next, setNext] = useState(false);
  const [image, setImage] = useState(undefined);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageError, setImageError] = useState(null);

  const fileRef = useRef(null);

  useEffect(() => {
    if (image) {
      handleImageUpload(image);
    }
  }, [image]);

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
        setImageError(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, coverImage: downloadURL });
        });
      },
    );
  }

  function handleTags(e) {
    setTagInput(e.target.value);
  }
  function handleAddTag(tag) {
    if (tag.trim() !== "") {
      if (!formData.tags.includes(tag)) {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, tag],
        }));
      }
      setTagInput("");
    }
  }
  function handleRemoveTag(tag) {
    setFormData((prevData) => {
      const newTags = [...prevData.tags];
      const index = newTags.indexOf(tag);

      if (index !== -1) {
        newTags.splice(index, 1);
      }

      return { ...prevData, tags: newTags };
    });
  }

  async function handleProceed(e) {
    e.preventDefault();
    dispatch(resetCurrentArticle());

    try {
      dispatch(createArticleStart());

      const articleData = {
        author: currentArticle ? currentUser._id : "",
        title: currentArticle ? currentArticle.title : "",
        content: currentArticle ? currentArticle.content : "",
        tags: formData.tags,
        coverImage: formData.coverImage,
      };

      const res = await axios.post("/api/articles", articleData, {
        withCredentials: true,
      });
      const data = res.data;

      dispatch(createArticleSuccess(data));

      navigate("/articles");

      dispatch(resetCurrentArticle());

      setShowPublish(false);
    } catch (error) {
      error.message = error.response.data
        ? error.response.data.message
        : error.response.statusText;
      dispatch(createArticleFailure(error.message));
    }
  }

  return (
    <div className="top-0 left-0 fixed bg-slate-50 bg-opacity-50 w-full h-full flex justify-center items-center">
      <div className="p-6 bg-gray-100 shadow-2xl fixed z-15 items-center md:w-1/3">
        {/* Select Tags */}

        <img
          alt="close"
          src="https://img.icons8.com/?size=48&id=pNXET7bXhanM&format=png"
          className="absolute w-5 h-5 top-2 right-2 hover:bg-zinc-300 cursor-pointer rounded-full"
          onClick={() => setShowPublish(false)}
        />
        <h2 className="text-lg text-center font-semibold p-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-indigo-600">
          {!next ? "Enter Tags" : "Add Cover Image"}
        </h2>
        <form className="flex flex-col items-center gap-2">
          {!next ? (
            <>
              {/* Add Tags */}
              <input
                id="tag"
                className="p-1 bg-slate-50 rounded-lg text-center text-zinc-600 outline-none outline-violet-700"
                placeholder="Tags"
                onChange={handleTags}
                onKeyDown={(e) => {
                  if (
                    e.key === " " ||
                    e.key === "Spacebar" ||
                    e.key === "Enter"
                  ) {
                    e.preventDefault();
                    handleAddTag(tagInput);
                  }
                }}
                value={tagInput}
                autoComplete="off"
              />
              <div className="flex justify-center items-center flex-wrap gap-2 max-h-40 overflow-y-auto mt-4">
                {formData.tags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="bg-violet-300 rounded-lg pl-1 px-2 flex items-center overflow-hidden select-none gap-1"
                  >
                    <img
                      alt="close"
                      src="https://img.icons8.com/?size=48&id=pNXET7bXhanM&format=png"
                      className="w-4 h-4 hover:bg-zinc-300 cursor-pointer rounded-lg"
                      onClick={() => handleRemoveTag(tag)}
                    />
                    <span className="font-medium text-violet-600">{tag}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={loading}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-center font-semibold w-32 px-4 py-2 mt-2 rounded-lg hover:opacity-95 disabled:opacity-80"
                onClick={(e) => {
                  e.preventDefault();
                  setNext(true);
                }}
              >
                Next
              </button>
            </>
          ) : (
            <>
              {/* Add Cover Image */}
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <img
                src={formData.coverImage || currentArticle.coverImage}
                alt="cover"
                onClick={() => fileRef.current.click()}
                className="h-24 w-24 self-center bg-slate-300 cursor-pointer rounded-2xl mt-2"
              />
              <span className="text-sm font-medium text-sky-800 opacity-60 self-center">
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
                  <span className="text-green-700">
                    Image uploaded successfully!
                  </span>
                ) : (
                  ""
                )}
              </p>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white text-center font-semibold w-32 px-4 py-2 mt-2 rounded-lg hover:opacity-95 disabled:opacity-80"
                onClick={handleProceed}
              >
                {loading ? "Proceeding..." : "Proceed"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default PublishArticle;
