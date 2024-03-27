import Comment from "../models/comments.js";

export const getComments = async (req, res) => {
	const articleId = req.params.id;
	const page = parseInt(req.query.page);

	try {
		if (!articleId) {
			return res.status(404).json({ message: "Article not found!" });
		}

		const limit = 5;
		const skip = (page - 1) * limit;

		const comments = await Comment.find({
			article: articleId,
			parentComment: null,
		})
			.populate("writer")
			.populate({
				path: "replies",
				populate: [{ path: "writer" }, { path: "replyingTo" }],
			})
			.skip(skip)
			.limit(limit);

		res.status(201).json(comments);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const createComment = async (req, res) => {
	const articleId = req.params.id;

	try {
		if (!articleId) {
			return res.status(404).json({ message: "Article not found!" });
		}

		const comment = new Comment({
			writer: req.user.id,
			article: articleId,
			content: req.body.content,
		});

		await comment.save();

		res.json({ message: "Comment posted successfully!" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const reply = async (req, res) => {
	const { commentId, articleId } = req.params;

	try {
		if (!articleId) {
			return res.status(404).json({ message: "Article not found!" });
		}

		if (!commentId) {
			return res.status(404).json({ message: "Parent comment not found!" });
		}

		const reply = new Comment({
			writer: req.user.id,
			article: articleId,
			content: req.body.content,
			parentComment: commentId,
			replyingTo: req.body.replyingTo,
		});

		await Comment.findOneAndUpdate(
			{ _id: commentId, article: articleId },
			{ $push: { replies: reply._id } },
		);

		const result = await reply.save();
		result.populate(["writer", "replyingTo"]);

		res.status(201).json(result);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteComment = async (req, res) => {
	const { commentId, articleId } = req.params;

	try {
		const comment = await Comment.findOne({
			_id: commentId,
			article: articleId,
		}).lean();

		if (!comment) {
			return res.status(404).json({ message: "Comment not found!" });
		}

		if (comment && comment.writer.toString() === req.user.id) {
			await Comment.deleteMany({ _id: { $in: comment.replies } });
			await Comment.deleteOne({ _id: commentId });
		} else {
			res.status(400).json({ message: "Deletion failed!" });
		}

		res.status(200).json({ message: "Comment deleted successfully!" });
	} catch (error) {
		res.status(500).json({ message: "Internal server error!" });
	}
};

export const likeComment = async (req, res) => {
	const { commentId, articleId } = req.params;

	const comment = await Comment.findOne({
		_id: commentId,
		article: articleId,
	});
	try {
		const userLikedIndex = comment.likes.indexOf(req.user.id);

		if (userLikedIndex !== -1) {
			comment.likes.splice(userLikedIndex, 1);
		} else {
			comment.likes.push(req.user.id);
		}

		await comment.save();

		res.status(200).json({ likes: comment.likes });
	} catch (error) {
		res.status(500).json({ message: error.message, comment: comment });
	}
};
