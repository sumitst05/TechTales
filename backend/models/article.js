import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		tags: [String],
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		coverImage: {
			type: String,
			default:
				"https://cdn.pixabay.com/photo/2015/04/20/22/43/pen-732372_960_720.png",
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
