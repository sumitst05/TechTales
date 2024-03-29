import mongoose from "mongoose";
import validator from "validator";
import { getRandomQuote } from "randoquoter";

const randomQuote = getRandomQuote();

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: validator.isEmail,
				message: "Please provide a valid email!",
			},
		},
		password: {
			type: String,
			required: true,
		},
		profilePicture: {
			type: String,
			default: "https://cdn-icons-png.freepik.com/128/3237/3237472.png",
		},
		bio: {
			type: String,
			default: randomQuote.text,
		},
		xAccount: {
			type: String,
		},
		githubProfile: {
			type: String,
		},
		likedArticles: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Article",
		},
		bookmarkedArticles: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Article",
		},
		following: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		followerCount: {
			type: Number,
			default: 0,
		},
		accessToken: {
			type: String,
		},
	},
	{ timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
