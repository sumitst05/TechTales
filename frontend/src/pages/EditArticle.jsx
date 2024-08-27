import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { editorStyle, modules, formats } from "../editorConfig";

import {
	updateArticleStart,
	updateArticleSuccess,
	updateArticleFailure,
	resetCurrentArticle,
} from "../redux/article/articleSlice";
import PublishArticle from "../components/PublishArticle";
import { useParams } from "react-router-dom";

function EditArticle() {
	const mode = import.meta.env.VITE_MODE;

	const { slug } = useParams();
	const articleId = slug.split("-").pop();

	const [showUpdate, setShowUpdate] = useState(false);

	const { currentArticle, loading, error } = useSelector(
		(state) => state.article,
	);
	const dispatch = useDispatch();

	useEffect(() => {
		const fetchArticle = async () => {
			try {
				dispatch(updateArticleStart());
				const res = await axios.get(`/api/articles/${articleId}`);
				dispatch(updateArticleSuccess(res.data));
			} catch (error) {
				error.message = error.response
					? error.response.data.message
					: error.response.statusText;
				updateArticleFailure(error.message);
			}
		};

		fetchArticle();

		return () => {
			dispatch(resetCurrentArticle());
		};
	}, [articleId]);

	function handleTitleChange(e) {
		const title = e.target.value;
		dispatch(updateArticleStart());
		dispatch(updateArticleSuccess({ ...currentArticle, title }));
	}

	function handleEditorChange(content) {
		dispatch(updateArticleStart());
		dispatch(updateArticleSuccess({ ...currentArticle, content }));
	}

	function handleUpdate() {
		setShowUpdate(!showUpdate);
	}

	return (
		<div className="write-article h-screen overflow-hidden">
			<div className="p-8 flex flex-col justify-center items-center gap-4 mt-12">
				<input
					type="text"
					placeholder="TITLE"
					value={currentArticle ? currentArticle.title : ""}
					onChange={handleTitleChange}
					className="relative text-center outline-none font-bold text-4xl font-serif text-gray-800 w-2/3 placeholder-gray-500"
				/>
				<ReactQuill
					theme="snow"
					value={currentArticle ? currentArticle.content : ""}
					formats={formats}
					modules={modules}
					style={editorStyle}
					onChange={handleEditorChange}
					placeholder="Write something amazing..."
				/>

				<button
					onClick={handleUpdate}
					disabled={loading}
					className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
				>
					Update
				</button>

				{showUpdate && (
					<PublishArticle setShowPublish={setShowUpdate} newArticle={false} />
				)}

				<div>
					<p className="text-red-700">
						{error ? error || "Something went wrong!" : ""}
					</p>
				</div>
			</div>
		</div>
	);
}

export default EditArticle;
