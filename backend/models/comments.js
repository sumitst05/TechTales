import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		writer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		article: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Article",
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		likes: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "User",
		},
		replies: {
			type: [mongoose.Schema.Types.ObjectId],
			ref: "Comment",
		},
		parentComment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
			default: null,
		},
		replyingTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{ timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
