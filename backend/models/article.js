import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		tags: [String],
		author: String,
		likes: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true },
);

const Article = mongoose.model("Article", articleSchema);

export default Article;