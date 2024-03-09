import bcrypt from "bcryptjs";

import User from "../models/user.js";

export const getUser = async (req, res) => {
	const { query, limit = 3 } = req.query;

	try {
		let users;

		if (!query) {
			users = await User.find().limit(5).select("-password");
			return res.status(200).json(users);
		}

		users = await User.find({
			username: { $regex: query, $options: "i" },
		})
			.limit(limit)
			.select("-password");

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await User.findById(userId)
			.populate(["likedArticles", "bookmarkedArticles"])
			.select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found!" });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const getBookmarkedArticles = async (req, res) => {
	try {
		const userId = req.params.id;
		const { page = 1, pageSize = 6 } = req.query;

		const skip = (page - 1) * pageSize;

		const user = await User.findById(userId)
			.populate("bookmarkedArticles")
			.skip(skip)
			.limit(pageSize);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const bookmarks = user.bookmarkedArticles;
		const totalArticles = bookmarks.length;

		res.status(200).json({ bookmarks, totalArticles });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const getLikedArticles = async (req, res) => {
	try {
		const userId = req.params.id;
		const { page = 1, pageSize = 6 } = req.query;

		const skip = (page - 1) * pageSize;

		const user = await User.findById(userId)
			.populate("likedArticles")
			.skip(skip)
			.limit(pageSize);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const likedArticles = user.likedArticles;
		const totalArticles = likedArticles.length;

		res.status(200).json({ likedArticles, totalArticles });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const updateUser = async (req, res) => {
	if (req.user.id !== req.params.id) {
		return res.status(401).json({ message: "Acess denied!" });
	}

	try {
		if (req.body.password) {
			req.body.password = await bcrypt.hash(req.body.password, 12);
		}

		const usernameConflict = await User.findOne({
			username: req.body.username,
			_id: { $ne: req.params.id },
		});
		if (usernameConflict) {
			return res.status(400).json({ message: "That username is taken!" });
		}

		const emailConflict = await User.findOne({
			email: req.body.email,
			_id: { $ne: req.params.id },
		});
		if (emailConflict) {
			return res
				.status(400)
				.json({ message: "That email is already registered!" });
		}

		const updateUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				profilePicture: req.body.profilePicture,
				bio: req.body.bio,
				likedArticles: req.body.likedArticles,
				bookmarkedArticles: req.body.bookmarkedArticles,
			},
			{ new: true },
		);

		const { password, ...user } = updateUser._doc;

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteUser = async (req, res) => {
	if (req.user.id !== req.params.id) {
		return res.status(401).json({ message: "Access denied!" });
	}

	try {
		await User.findByIdAndDelete(req.params.id);
		res
			.clearCookie("access_token")
			.status(200)
			.json({ message: "User deleted successfully!" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};
