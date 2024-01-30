import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String },
		tags: [String],
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		coverImage: {
			type: String,
		},
		likes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
