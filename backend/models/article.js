import mongoose, { Schema } from "mongoose";

const articleSchema = new Schema(
	{
		title: String,
		content: String,
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
