import bcrypt from "bcryptjs";

import User from "../models/user.js";
import Article from "../models/article.js";

export const getUser = async (req, res) => {
	const { query, limit = 3 } = req.query;

	try {
		let users;

		if (!query) {
			users = await User.find()
				.sort({ followerCount: -1 })
				.limit(5)
				.select("-password");
			return res.status(200).json(users);
		}

		users = await User.find({
			username: { $regex: query, $options: "i" },
		})
			.sort({ following: -1 })
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
		const userId = req.user.id;
		const { page = 1, pageSize = 6 } = req.query;

		const skip = (page - 1) * pageSize;

		const user = await User.findById(userId)
			.populate({
				path: "bookmarkedArticles",
				options: {
					sort: { likes: 1 },
				},
			})
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
		const userId = req.user.id;
		const { page = 1, pageSize = 6 } = req.query;

		const skip = (page - 1) * pageSize;

		const user = await User.findById(userId)
			.populate({
				path: "likedArticles",
				options: {
					sort: { likes: 1 },
				},
			})
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
	try {
		if (req.body.password) {
			req.body.password = await bcrypt.hash(req.body.password, 12);
		}

		const usernameConflict = await User.findOne({
			username: req.body.username,
			_id: { $ne: req.user.id },
		});
		if (usernameConflict) {
			return res.status(400).json({ message: "That username is taken!" });
		}

		const emailConflict = await User.findOne({
			email: req.body.email,
			_id: { $ne: req.user.id },
		});
		if (emailConflict) {
			return res
				.status(400)
				.json({ message: "That email is already registered!" });
		}

		const updateUser = await User.findByIdAndUpdate(
			req.user.id,
			{
				username: req.body.username,
				email: req.body.email,
				password: req.body.password,
				profilePicture: req.body.profilePicture,
				bio: req.body.bio,
				likedArticles: req.body.likedArticles,
				bookmarkedArticles: req.body.bookmarkedArticles,
				xAccount: req.body.xAccount,
				githubProfile: req.body.githubProfile,
			},
			{ new: true },
		);

		const { password, ...user } = updateUser._doc;

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getFollowersAndFollowing = async (req, res) => {
	try {
		const userId = req.params.id;

		const rawFollowing = await User.findById(userId).populate("following");
		const following = rawFollowing.following.map((item) => ({
			_id: item._id,
			username: item.username,
			profilePicture: item.profilePicture,
			createdAt: item.createdAt,
			bio: item.bio,
			followerCount: item.followerCount,
		}));

		const rawFollowers = await User.find({ following: userId }).populate(
			"following",
		);
		const followers = rawFollowers.map((item) => ({
			_id: item._id,
			username: item.username,
			profilePicture: item.profilePicture,
			createdAt: item.createdAt,
			bio: item.bio,
			followerCount: item.followerCount,
		}));

		res.status(200).json({ following, followers });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const follow = async (req, res) => {
	const followedUser = await User.findById(req.params.id);
	followedUser.followerCount += req.query.unfollow === "true" ? -1 : 1;
	await followedUser.save();

	const updateUser = await User.findByIdAndUpdate(
		req.user.id,
		{
			following: req.body.following,
		},
		{ new: true },
	);

	const { password, ...user } = updateUser._doc;

	res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
	try {
		await Article.deleteMany({ author: req.user.id });
		await User.findByIdAndDelete(req.user.id);

		res
			.clearCookie("access_token")
			.status(200)
			.json({ message: "User deleted successfully!" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};
