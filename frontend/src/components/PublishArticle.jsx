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
	updateArticleStart,
} from "../redux/article/articleSlice";

function PublishArticle({ setShowPublish, newArticle }) {
	const { currentArticle, loading } = useSelector((state) => state.article);
	const { currentUser } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const defaultCover = "/article_cover.png?url";
	const [formData, setFormData] = useState({
		tags: currentArticle.tags ? currentArticle.tags : [],
		coverImage: currentArticle.coverImage
			? currentArticle.coverImage
			: defaultCover,
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
			const processedTags = tag.split(" ").map((t) => t.trim());

			const newTags = processedTags.filter(
				(tag) => !formData.tags.includes(tag),
			);

			if (newTags.length > 0) {
				setFormData((prevData) => ({
					...prevData,
					tags: [...prevData.tags, ...newTags],
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
			newArticle
				? dispatch(createArticleStart())
				: dispatch(updateArticleStart());

			const articleData = {
				author: currentArticle ? currentUser._id : "",
				title: currentArticle ? currentArticle.title : "",
				content: currentArticle ? currentArticle.content : "",
				tags: formData.tags,
				coverImage: formData.coverImage,
			};

			const res = newArticle
				? await axios.post("/api/articles", articleData, {
						withCredentials: true,
					})
				: await axios.patch(
						`/api/articles/${currentArticle._id}`,
						articleData,
						{
							withCredentials: true,
						},
					);

			const data = res.data;

			dispatch(createArticleSuccess(data));

			navigate("/your-articles");

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
		<div className="fixed top-0 left-0 z-50 bg-slate-50 bg-opacity-50 w-full h-full flex justify-center items-center">
			<div className="p-6 bg-gray-100 shadow-2xl fixed z-15 items-center md:w-1/3 select-none">
				<button
					className="absolute top-0 right-2 text-violet-700 hover:text-indigo-700 text-3xl font-semibold"
					onClick={() => setShowPublish(false)}
				>
					&times;
				</button>
				<h2 className="text-lg text-center font-semibold p-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-indigo-600">
					{!next ? "Enter Tags" : "Add Cover Image"}
				</h2>
				<p className="flex justify-center text-sm font-medium text-zinc-800 opacity-60 mb-2">
					{!next
						? "Type tag name and press Space/Enter"
						: "Image size must be under 2MB"}
				</p>
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
										e.key === "Spacebar" ||
										e.key === " " ||
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
											src="/close.png"
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
								value=""
								onChange={(e) => setImage(e.target.files[0])}
							/>
							<img
								src={formData.coverImage || currentArticle.coverImage}
								alt="cover"
								onClick={() => fileRef.current.click()}
								className="h-24 w-24 self-center bg-slate-300 cursor-pointer rounded-2xl mt-2"
							/>
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
							<img
								src="/back.png"
								alt="back"
								className="absolute w-5 h-5 bottom-2 left-2 hover:bg-zinc-300 cursor-pointer rounded-full"
								onClick={() => setNext(false)}
								hidden={!next}
							/>
						</>
					)}
				</form>
			</div>
		</div>
	);
}

export default PublishArticle;
