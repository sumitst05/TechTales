import Article from "./models/article.js";
import User from "./models/user.js";

export const likeArticle = (socket, io) => {
	socket.on("likeArticle", async (data) => {
		const { articleId, userId, likedArticles, liked, likes } = data;
		const updatedLikes = liked ? likes - 1 : likes + 1;

		try {
			const article = await Article.findOneAndUpdate(
				{ _id: articleId },
				{ likes: updatedLikes },
				{ new: true },
			);

			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ likedArticles },
				{ new: true },
			);

			if (!article) {
				socket.emit("likeArticleError", { message: "Article not found!" });
			}
			if (!user) {
				socket.emit("likeArticleError", { message: "User not found!" });
			}

			io.emit("articleLiked", { articleId, updatedLikes });
			socket.emit("userUpdated", user);
		} catch (error) {
			socket.emit("likeArticleError", { message: "Internal server error!" });
			console.error("LikeArticle error:", error);
		}
	});
};
