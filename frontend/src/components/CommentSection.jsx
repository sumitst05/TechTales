import { useEffect, useState } from "react";
import axios from "axios";
import Comments from "./Comments";

const CommentSection = ({ onClose, articleId }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [input, setInput] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	function handleClose() {
		setIsVisible(false);
		setTimeout(() => {
			onClose();
		}, 300);
	}

	function handleInput(e) {
		setInput(e.target.value);
	}

	async function handlePost(e) {
		e.preventDefault();

		try {
			await axios.post(
				`/api/comment/${articleId}`,
				{ content: input },
				{ withCredentials: true },
			);
			setInput("");
		} catch (error) {
			console.log(error.message);
		}
	}

	return (
		<>
			<div
				className={`fixed inset-0 bg-black bg-opacity-50 z-10 ${isVisible ? "" : "hidden"}`}
				onClick={onClose}
			></div>
			<div
				className={`mt-16 fixed inset-0 z-10 flex justify-start items-center transition-transform ease-in-out duration-300 transform ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="w-full md:w-5/12 h-full bg-white overflow-auto">
					<div className="p-4">
						<div className="flex justify-between items-center">
							<h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-800 to-indigo-600">
								Comments
							</h2>
							<button
								className="text-violet-700 hover:text-indigo-700 text-3xl font-semibold"
								onClick={handleClose}
							>
								&times;
							</button>
						</div>
						<form className="mt-4">
							<textarea
								className="w-full bg-gray-100 p-2 rounded-lg outline-none outline-zinc-400 focus:outline-violet-700 resize-none"
								rows={5}
								placeholder="Write your comment..."
								onChange={(e) => handleInput(e)}
								value={input}
							></textarea>
							<button
								type="submit"
								className="mt-2 px-4 py-2 text-white rounded bg-gradient-to-r from-violet-800 to-indigo-600 hover:opacity-90"
								onClick={(e) => handlePost(e)}
							>
								Post
							</button>
						</form>
						<div className="flex flex-col justify-center items-center mt-4">
							<Comments articleId={articleId} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CommentSection;
