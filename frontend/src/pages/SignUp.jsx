import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import OAuth from "../components/OAuth";

function SignUp() {
	const [formData, setFormData] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	function handleChange(e) {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	}

	async function handleSubmit(e) {
		e.preventDefault();

		try {
			setLoading(true);

			await axios.post("/api/auth/signup", formData, {
				withCredentials: true,
			});

			setError(false);
			setLoading(false);

			navigate("/sign-in");
		} catch (error) {
			setLoading(false);
			setError(error.response ? error.response.data.message : error.message);
		}
	}

	return (
		<div className="p-3 max-w-lg mx-auto mt-16">
			<h1 className="text-4xl text-center font-semibold p-4 my-7 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-800">
				Sign Up
			</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<input
					type="text"
					id="username"
					placeholder="Username"
					className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
					onChange={handleChange}
				/>
				<input
					type="email"
					id="email"
					placeholder="Email"
					className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
					onChange={handleChange}
				/>
				<input
					type="password"
					id="password"
					placeholder="Password"
					className="bg-slate-200 p-3 rounded-lg outline-none focus:outline-violet-700"
					onChange={handleChange}
				/>
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
							<span>Sign Up</span>
						</div>
					)}
				</button>
				<OAuth />
			</form>

			<div className="flex gap-2 mt-5">
				<p className="text-slate-700">Already have an account?</p>
				<Link to="/sign-in">
					<span className="text-blue-500">Sign in</span>
				</Link>
			</div>

			<div>
				<p className="text-red-700 mt-5">
					{error ? error || "Signup failed" : ""}
				</p>
			</div>
		</div>
	);
}

export default SignUp;
